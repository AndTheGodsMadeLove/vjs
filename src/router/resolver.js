/**
 * @version 0.1-alpha
 */

/**
 * VJS Resolver
 * Resolver utilized by VJS Router
 */
export class Resolver {
  /**
   * initialize Resolver
   */
  constructor() {
    /**
     * routes
     * @private
     * @type {Array.<ResolverRoute>}
     */
    this.routes = [];
  }

  /**
   * returns the regular expression to perform
   * search queries on the routes
   * @private
   * @param {string} path
   * @returns {RegExp}
   */
  createMatchExp(path) {
    const regexStr = path.replace(/:([\w-]+)(\?{0,1})/g, this.replaceCallback);

    return new RegExp(`^${regexStr}$`);
  }

  /**
   * returns the replace string for matches
   * @private
   * @param {string} match
   * @param {string} groupName
   * @param {string} isOptionalModifierString
   * @returns {string}
   */
  replaceCallback(match, groupName, isOptionalModifierString) {
    let str = `(?<${groupName}>[\\w-]+)`;
    if (isOptionalModifierString === '?') {
      str = `?${str}?`;
    }

    return str;
  }

  /**
   * returns a route object for internal use
   * @private
   * @param {RouterRoute} route
   * @returns {ResolverRoute}
   */
  createRoute(route) {
    const matchExp = this.createMatchExp(route.path);
    return {
      matchExp,
      path: route.path,
      component: route.component,
    };
  }

  /**
   * set routes for the router
   * @public
   * @param {Array.<RouterRoute>} routes
   */
  setRoutes(routes) {
    this.routes = routes.map((route) => this.createRoute(route));
  }

  /**
   * returns configured routes
   * @public
   * @returns {Array.<RouterRoute>}
   */
  getRoutes() {
    return this.routes.map((route) => ({
      path: route.path,
      component: route.component,
    }));
  }

  /**
   * removes a route from the existing configuration
   * @public
   * @param {RouterRoute} route
   */
  removeRoute(route) {
    this.routes = this.routes.filter((r) => r.path !== route.path);
  }

  /**
   * remove a route from the existing configuration
   * filtered by the path property of the route object
   * @public
   * @param {string} path
   */
  removeRouteByPath(path) {
    this.routes = this.routes.filter((r) => r.path !== path);
  }

  /**
   * resolves pathname into its componentKey and parameters
   * @param {string} pathname
   * @returns {Promise}
   */
  resolve(pathname) {
    const strippedPathname = pathname.replace(/\/$/, '') || '/';
    return new Promise((resolve, reject) => {
      for (let i = 0; i < this.routes.length; ++i) {
        const match = strippedPathname.match(this.routes[i].matchExp);
        if (match) {
          const componentKey = this.routes[i].component;
          // @ts-ignore - default ts compiler does not support group property on RegExpMatchArray
          const parameter = match.groups;
          resolve({ componentKey, parameter, pathname });
        }
      }
      reject({
        error: 404,
      });
    });
  }
}
