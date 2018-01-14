const crossroads = require('crossroads');

const DEFAULT_CONFIG = {
  interceptLinks: false, // By default, don't interfere with clicks on links on the page
};

// Shim for Element.closest()
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}
if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    var el = this;
    if (!document.documentElement.contains(el)) return null;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null);
    return null;
  };
}

export default class {
  // Create a new router, given a reference to the redux store for action dispatch
  constructor(store, config = {}) {
    // Keep bound reference to dispatch so we can dispatch actions in route handlers
    this.dispatch = store.dispatch.bind(store);

    // Handler to run additional post-match logic, useful internally in some cases
    this.onMatch = () => { };

    // Keep our config options around
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // Registers a new route.
  //
  // Takes a path and a handler.
  //
  // Path can be of the form /foo/{bar}/{baz} to match the bar param and baz param.
  //
  // Handler takes the params matched in the URL ((bar, baz) => { } for the example above), and must return a Redux action.
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

  // Searches for a matching path, and if it finds one, runs the associated handlers.
  //
  // Optional: additional handler to run after the standard handler does its thing.
  //
  navigate(path, handler = () => {}) {
    console.log(`Checking for route matches for ${path}`);

    const oldOnMatch = this.onMatch;
    this.onMatch = handler;
    crossroads.parse(path);
    this.onMatch = oldOnMatch;
  }

  // Makes a purely aesthetic update to the location - this won't affect navigation / history.
  //
  // Optionally updates the title as well.
  //
  // ** Disabled eslint rule that tries to force this to be static because the router should be singleton.
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

  // Starts listening for and handling route changes
  //
  start() {
    const router = this;

    // Listen for history state change
    window.onpopstate = (evt) => {
      let targetPath;
      if (evt.state && evt.state.pretty) {
        targetPath = evt.originalPath;
      } else {
        targetPath = document.location.pathname;
      }
      crossroads.parse(targetPath || '');
    };

    // Intercept link clinks and run through router when appropriate
    if (router.config.interceptLinks) {
      document.body.addEventListener('click', (evt) => {
        // Only process clicks on elements with hrefs set for the current host
        const $parentLink = evt.target.closest('a');
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
          // Tries to match the route,
          // and prevents link click default behavior (navigate away) in the case of a match.
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
