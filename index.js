import $ from 'jquery';

const crossroads = require('crossroads');

const DEFAULT_CONFIG = {
  interceptLinks: false, // by default don't interfere with clicks on links on the page
};

export default class {
  // create a new router, given a reference to the redux store for action dispatch
  constructor(store, config = {}) {
    // keep bound reference to dispatch so we can dispatch actions in route handlers
    this.dispatch = store.dispatch.bind(store);

    // handler to run additional post-match logic, useful internally in some cases
    this.onMatch = () => { };

    // keep our config options around
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // register a new route
  //
  // takes a path and a handler
  //
  // path can be of the form /foo/{bar}/{baz} to match the bar param and baz param
  //
  // handler is of the form (bar, baz) => { } and must return return an action
  //
  route(pathOrPaths, handler) {
    const router = this;

    const addRoute = (path) => {
      crossroads.addRoute(path, (...args) => {
        console.log(`Route matched ${path}`);

        const decodedArgs = args.map(window.decodeURIComponent);
        router.dispatch(handler(...decodedArgs));
        if (router.onMatch) {
          router.onMatch();
        }
      });
    };

    if (Array.isArray(pathOrPaths)) {
      pathOrPaths.forEach(addRoute);
    } else {
      addRoute(pathOrPaths);
    }
  }

  // match a path and run associated handlers
  //
  // optional: handler to run in the case of a match after the standard handler runs
  //
  match(path, handler = () => {}) {
    console.log(`Checking for route matches for ${path}`);

    const oldOnMatch = this.onMatch;
    this.onMatch = handler;
    crossroads.parse(path);
    this.onMatch = oldOnMatch;
  }

  // make a purely aesthetic update to the location - this won't effect navigation / history
  //
  // optionally update the title as well

  // disabled eslint rule that tries to force this to static because the router should be singleton
  prettify(path, title) { // eslint-disable-line class-methods-use-this
    console.log(`Aesthetic path update: ${path}`);
    window.history.replaceState(
      {
        pretty: true,
        orginalPath: window.location.pathname,
      },
      title,
      path,
    );
    if (title) {
      document.title = title;
    }
  }

  // navigate to a new path, running any associated handlers
  navigate(path) {
    console.log(`Navigating to ${path}`);
    this.match(path);
  }

  // start listening for and handling route changes
  //
  start() {
    const router = this;

    // listen for history state change
    window.onpopstate = (evt) => {
      let targetPath;
      if (evt.state && evt.state.pretty) {
        targetPath = evt.originalPath;
      } else {
        targetPath = document.location.pathname;
      }
      crossroads.parse(targetPath || '');
    };

    // intercept link clinks and run through router when appropriate
    if (router.config.interceptLinks) {
      document.body.addEventListener('click', (evt) => {
        // only process clicks on elements with hrefs set for the current host
        const $parentLink = $(evt.target).closest('a');
        const parseLink = document.createElement('a');
        let href;
        if (!evt.target.href && $parentLink && $parentLink.length > 0) {
          parseLink.href = $parentLink.attr('href');
          href = parseLink.href; // eslint-disable-line prefer-destructuring
        } else {
          href = evt.target.href; // eslint-disable-line prefer-destructuring
        }
        console.log(evt, $parentLink, href);
        const currentHost = (
          href &&
          evt.target.hostname &&
          evt.target.hostname === window.location.hostname
        );
        const hashChange = (
          href &&
          href.split('#')[0] === window.location.href.split('#')[0] &&
          href.indexOf('#') !== -1
        );
        if (hashChange) {
          router.prettify(href);
          evt.preventDefault();
        }
        if (currentHost && !hashChange) {
          // try to match the route,
          // prevent link click default behavior (navigate away) in the case of a match
          router.match(evt.target.pathname, () => {
            evt.preventDefault();
            window.history.pushState({}, '' /* TODO: consistent title for history */, evt.target.pathname);
          });
        }
      });
    }

    crossroads.ignoreState = true;

    // actually parse our current route
    router.match(document.location.pathname);
  }
}
