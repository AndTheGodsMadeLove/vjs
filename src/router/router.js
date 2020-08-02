/**
 * @version 0.1-alpha
 *
 * @requires './resolver.js:Resolver
 * @requires './../util/util.js:flushElement
 * @requires './../util/util.js:isEqual
 */

// eslint-disable-next-line
/// <reference path='./typedef.js' />

import { Resolver } from './resolver.js';
import { flushElement, isEqual } from './../util/util.js';

/**
 * default options
 * @type {RouterOptions} ROUTER_DEFAULT_OPTIONS
 */
export const ROUTER_DEFAULT_OPTIONS = {
  container: null,
  routes: [],
  initViewsAtStart: false,
  anchorScan: null,
  debug: false,
};

export const ROUTER_DEFAULT_LOCATION_STATE = {
  componentKey: null,
  parameter: {},
  pathname: null,
};

export const ROUTER_EVT_CLICK = 'vjs:router:click';

export const ROUTER_EVT_POPSTATE = 'vjs:router:popstate';

export const ROUTER_EVT_NAVIGATE = 'vjs:router:navigate';

export const ROUTER_EVT_BEFORE_LEAVE = 'vjs:router:beforeLeave';

export const ROUTER_EVT_AFTER_LEAVE = 'vjs:router:afterLeave';

/**
 * VJS Router
 * Router for SPAs utilizing native web components
 */
export class Router {
  /**
   * initialize Router
   * @param {HTMLElement} container
   * @param {Object.<string, any>} [options]
   */
  constructor(container, options = ROUTER_DEFAULT_OPTIONS) {
    /**
     * holds the configuration of the router
     * @private
     * @type {RouterOptions}
     */
    this.options;

    /**
     * surface HTMLElement for the router views
     * @private
     * @type {HTMLElement}
     */
    this.container = container;

    /**
     * cache of loaded components
     * @private
     * @type {Map.<string, HTMLElement>}
     */
    this.cache = new Map();

    /**
     * current state of the router
     * @private
     * @type {RouterLocation}
     */
    this.location;

    /**
     * VJS Resolver
     * @private
     * @type {Resolver}
     */
    this.resolver = new Resolver();

    // force scope on methods used by eventListener
    this.onAnchorClick = this.onAnchorClick.bind(this);
    this.onPopState = this.onPopState.bind(this);

    // initialize Router

    // set merged options
    this.setOptions(options);
    // set default location state
    this.setLocation(ROUTER_DEFAULT_LOCATION_STATE);
    // init all view components if required
    if (this.options.initViewsAtStart) {
      this.resolver.getRoutes().forEach((r) => this.initComponent(r.component));
    }
    // scan HTMLElement for HTMLAnchorElements and
    // add eventListener
    if (this.options.anchorScan && this.options.anchorScan instanceof HTMLElement) {
      this.anchorScan(this.options.anchorScan);
    }

    window.addEventListener('popstate', this.onPopState);
    window.addEventListener(ROUTER_EVT_NAVIGATE, (e) => {
      const { detail } = /** @type {CustomEvent} */(e);
      this.goTo(detail.url);
    });
  }

  /**
   * sets location state
   * @private
   * @param {RouterLocation} location
   */
  setLocation(location) {
    this._location = {
      ...this._location,
      ...location,
    };
  }

  /**
   * get location state
   * @private
   * @returns {RouterLocation}
   */
  getLocation() {
    return { ...this._location };
  }

  /**
   * scan for anchor elements and add event listener
   * @private
   * @param {HTMLElement} root - element used for anchorScan
   */
  anchorScan(root) {
    const anchorElement = [...root.querySelectorAll('a')];
    anchorElement.forEach((a) => a.addEventListener('click', this.onAnchorClick));
  }

  /**
   * initialize component and add it to the cache
   * @private
   * @param {string} componentKey
   */
  initComponent(componentKey) {
    const component = document.createElement(componentKey);
    this.cache.set(componentKey, component);
  }

  /**
   * this method will handle loading in future ;)
   * @private
   * @param {RouterLocation} state
   */
  displayComponent(state) {
    // init component if not already in cache
    if (!this.cache.has(state.componentKey)) {
      this.initComponent(state.componentKey);
    }

    // get component and update location object
    const component = this.cache.get(state.componentKey);
    this.setLocation(state);
    // @ts-ignore
    component.location = this.getLocation();

    // render component
    flushElement(this.container);
    if (this.container instanceof HTMLElement) {
      this.container.appendChild(component);
    } else {
      throw new Error('The "container" property inside the RouterOptions has to be from the type "HTMLElement"');
    }
  }

  /**
   * @private
   * @param {string} type
   * @param {object} detail
   */
  dispatchRouterEvent(type, detail) {
    window.dispatchEvent(new CustomEvent(type, { detail }));
  }

  /**
   * @private
   * @param {string} componentKey
   * @returns {HTMLElement}
   */
  getCachedComponentByKey(componentKey) {
    if (componentKey === null) return null;

    if (!this.cache.has(componentKey)) {
      this.initComponent(componentKey);
    }
    return this.cache.get(componentKey);
  }

  /**
   * @private
   * @param {HTMLElement} component
   * @param {string} callbackName
   * @param {string} eventIdentifier
   * @param {object} payload
   */
  runHookIfAvailable(component, callbackName, eventIdentifier, payload) {
    // check if there is a callback we have to invoke
    if (typeof component[callbackName] === 'function') {
      // invoke callback
      const { prevLocation, nextLocation } = payload;
      component[callbackName](prevLocation, nextLocation);
    }

    // dispatch beforeLeave event
    this.dispatchRouterEvent(eventIdentifier, payload);
  }

  /**
   * click handler for navigation anchor
   * @private
   * @param {MouseEvent} e
   */
  onAnchorClick(e) {
    e.preventDefault();
    const { pathname } = /** @type {HTMLAnchorElement} **/(e.target);
    this.dispatchRouterEvent(ROUTER_EVT_CLICK, { pathname });
    this.goTo(pathname);
  }

  /**
   * handles the back and forward inputs of the browser
   * @private
   * @param {PopStateEvent} e
   */
  onPopState({ state }) {
    this.displayComponent(state);
  }

  /**
   * set options for router configuration
   * @public
   * @param {Object.<string, any>} options
   */
  setOptions(options) {
    this.options = {
      ...ROUTER_DEFAULT_OPTIONS,
      ...options,
    };

    this.setRoutes(this.options.routes);
  }

  /**
   * returns current router configuration
   * @public
   * @returns {RouterOptions}
   */
  getOptions() {
    return { ...this.options };
  }

  /**
   * load component by url
   * @public
   * @param {string} url
   */
  goTo(url) {
    this.resolver.resolve(url)
      .then((state) => {
        // guard clause checking if there is a state change
        if (!isEqual(this.getLocation(), state)) {
          // compose detail object
          const detail = {
            prevLocation: this.getLocation(),
            nextLocation: state,
          };
          // fetch current view component if possible
          const prevComponent = this.getCachedComponentByKey(this.getLocation().componentKey);
          if (prevComponent !== null) {
            // run lifecycle hooks if available
            this.runHookIfAvailable(prevComponent, 'onBeforeLeave', ROUTER_EVT_BEFORE_LEAVE, detail);
          }

          // update history and dispatch popstate event
          window.history.pushState(state, '', state.pathname);
          this.dispatchRouterEvent(ROUTER_EVT_POPSTATE, state);

          if (prevComponent !== null) {
            // run lifecycle hooks if available
            this.runHookIfAvailable(prevComponent, 'onAfterLeave', ROUTER_EVT_AFTER_LEAVE, detail);
          }

          // display component
          this.displayComponent(state);
        }
      })
      .catch((err) => console.log('error>', err));
  }

  /**
   * set routes for the router
   * @public
   * @param {Array.<RouterRoute>} routes
   */
  setRoutes(routes) {
    this.resolver.setRoutes(routes);
  }

  /**
   * returns configured routes
   * @public
   * @returns {Array.<RouterRoute>}
   */
  getRoutes() {
    return this.resolver.getRoutes();
  }

  /**
   * removes a route from the existing configuration
   * @public
   * @param {RouterRoute} route
   */
  removeRoute(route) {
    this.resolver.removeRoute(route);
  }

  /**
   * remove a route from the existing configuration
   * filtered by the path property of the route object
   * @public
   * @param {string} path
   */
  removeRouteByPath(path) {
    this.resolver.removeRouteByPath(path);
  }

  /**
   * load component by url
   * @public
   * @param {string} url
   */
  static go(url) {
    window.dispatchEvent(new CustomEvent(ROUTER_EVT_NAVIGATE, {
      detail: { url },
    }));
  }
}
