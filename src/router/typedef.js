/**
 * public route
 * @typedef {Object} RouterRoute
 * @property {string} path - path of the route
 * @property {string} component - HTML tag of the component
 */

/**
 * router location state
 * @typedef {Object} RouterLocation
 * @property {string} componentKey - holds the HTMLTag of the component
 * @property {Object.<string, string>} parameter - holds the parameter of the location
 * @property {string} pathname - string of the current pathname
 */

/**
 * options
 * @typedef {Object} RouterOptions
 * @property {HTMLElement} container - HTMLElement utilized as container for the components
 * @property {Array.<ResolverRoute>} routes - array of internal route objects
 * @property {boolean} initViewsAtStart - initialize all view components
 * @property {HTMLElement} anchorScan - HTMLElement used to scan for anchor elements
 * @property {boolean} debug - debug mode
 */

/**
 * public route
 * @typedef {Object} ResolverRoute
 * @property {string} path - path of the route
 * @property {string} component - HTML tag of the component
 * @property {RegExp} matchExp - RegExp used to match urls
 */
