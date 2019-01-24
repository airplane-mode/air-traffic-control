const crossroads = require("crossroads");

const DEFAULT_CONFIG = {
  interceptLinks: false, // By default, don't interfere with clicks on links on the page
};

// Shim for Element.closest()
if (typeof (Element) !== "undefined") {
  if (!Element.prototype.matches) {
    Element.prototype.matches = (
      Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector
    );
  }
  if (!Element.prototype.closest) {
    Element.prototype.closest = function closest(s) {
      let el = this;
      if (!document.documentElement.contains(el)) return null;
      do {
        if (el.matches(s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null);
      return null;
    };
  }
}

export class Router {
  /**
   * Creates a new router, given a reference to the redux store for action dispatch
   *
   * @constructor
   * @param {object} store - Your redux store.
   * @param {object} config - Additional configuration parameters.
   *                          Currently only supports the interceptLinks property.
   */
  constructor(store, config = {}) {
    // Keep bound reference to dispatch so we can dispatch actions in route handlers
    this.dispatch = store.dispatch.bind(store);

    // Handler to run additional post-match logic, useful internally in some cases
    this.onMatch = () => { };

    // Keep our config options around
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Registers a new route.
   *
   * @param {string} pathOrPaths -  (Optionally an array of strings)
   *                                The path of paths that will trigger the handler.
   *                                A path can be of the form /foo/{bar}/{baz} to match
   *                                the bar param and baz param.
   * @param {string} handler -  A handler that takes the params matched in the URL
   *                            ((bar, baz) => { } for the example above),
   *                            and returns a Redux action.
   */
  route(pathOrPaths, handler) {
    const router = this;

    const addRoute = (path) => {
      crossroads.addRoute(path, (...args) => {
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

  /**
   * Searches for a matching path, and if it finds one, runs the associated handlers.
   *
   * @param {string} path - The path to which to navigate.
   * @param {object} handler - (Optional) An additional handler to run after the standard handler.
   */
  navigate(path, handler = () => {}) {
    const oldOnMatch = this.onMatch;
    this.onMatch = handler;
    crossroads.parse(path);
    this.onMatch = oldOnMatch;
  }

  /**
   * Updates the path and, optionally, the title of the page without firing any handlers.
   * This will be a purely aesthetic update to the location, and won't affect navigation / history.
   *
   * @param {string} path - The new path.
   * @param {string} title - (Optional) The new title.
   *
   */
  prettify(path, title, state = {}) { // eslint-disable-line class-methods-use-this
    window.history.pushState(state, title, path);
    if (title) {
      document.title = title;
    }
  }

  /**
   * Starts the router and begins listening for actions and navigation changes.
   */
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
      crossroads.parse(targetPath || "");
    };

    // Intercept link clinks and run through router when appropriate
    if (router.config.interceptLinks) {
      document.body.addEventListener("click", (evt) => {
        // Only process clicks on elements with hrefs set for the current host
        const $parentLink = evt.target.closest("a");
        const parseLink = document.createElement("a");
        let href;
        if (!evt.target.href && $parentLink && $parentLink.length > 0) {
          parseLink.href = $parentLink.attr("href");
          href = parseLink.href; // eslint-disable-line prefer-destructuring
        } else {
          href = evt.target.href; // eslint-disable-line prefer-destructuring
        }
        const currentHost = (
          href &&
          evt.target.hostname &&
          evt.target.hostname === window.location.hostname
        );
        const hashChange = (
          href &&
          href.split("#")[0] === window.location.href.split("#")[0] &&
          href.indexOf("#") !== -1
        );
        if (hashChange) {
          router.prettify(href);
          evt.preventDefault();
        }
        if (currentHost && !hashChange) {
          // Tries to match the route,
          // and prevents link click default behavior (navigate away) in the case of a match.
          router.navigate(evt.target.pathname, () => {
            evt.preventDefault();
            window.history.pushState({}, "" /* TODO: consistent title for history */, evt.target.pathname);
          });
        }
      });
    }

    crossroads.ignoreState = true;

    // actually parse our current route
    router.navigate(document.location.pathname);
  }
}
