[![GitHub license](https://img.shields.io/github/license/AndTheGodsMadeLove/vjs.svg)](https://github.com/AndTheGodsMadeLove/vjs/blob/master/LICENSE) [![GitHub tag](https://img.shields.io/github/tag/AndTheGodsMadeLove/vjs.svg)](https://GitHub.com/AndTheGodsMadeLove/vjs/tags/) ![GitHub commits](https://img.shields.io/github/commits-since/AndTheGodsMadeLove/vjs/v0.1-alpha.svg) [![GitHub contributors](https://img.shields.io/github/contributors/AndTheGodsMadeLove/vjs.svg)](https://GitHub.com/AndTheGodsMadeLove/vjs/graphs/contributors/) [![Github all releases](https://img.shields.io/github/downloads/AndTheGodsMadeLove/vjs/total.svg)](https://GitHub.com/AndTheGodsMadeLove/vjs/releases/)

# VJS
VJS aims to be a lightweight framework for native web components which can be utilized to create SPA without almost any effort. Feel free to contribute in any way, your input is highly welcome! :thumbsup:

**The project itself is in the very beginning of the development process and almost everything is missing at this point.** :thumbsdown:

## Table of Contents
-  [Getting Started - TBD](#getting-started)
- [Router](#router)
  - [Types](#types)
  - [Class: Router - TBD](#class-router)
    - [Properties - TBD](#router-properties)
    - [Methods - TBD](#router-methods)
    - [Events - TBD](#router-events)
  - [Class: Resolver - TBD](#class-resolver)
    - [Properties - TBD](#resolver-properties)
    - [Methods - TBD](#resolver-methods)
    - [Events - TBD](#resolver-events)
  - [Class: View - TBD](#class-view)
    - [Properties - TBD](#view-properties)
    - [Methods - TBD](#view-methods)
    - [Events - TBD](#view-events)
  - [Location Object - TBD](#location-object)
- [ToDo](#todo)

# Router
> A router is a key component in most frontend frameworks. It is the piece of software in charge to organize the states of the application and switching between different views.

## Types

#### {Object} IResolverRoute
| Name | Type | Description |
| --- | --- | --- |
| matchExp | <code>RegExp</code> | RegExp used to match urls |

#### {Object} IRouterLocation
| Name | Type | Description |
| --- | --- | --- |
| location | <code>RouterLocation</code> | location object utilized for viewComponents and events |

#### {Object} IView
| Name | Type | Description |
| --- | --- | --- | --- |
| location | <code>RouterLocation</code> | location object utilized for viewComponents and events |
| onBeforeLeave | <code>function</code> | lifecycle for ViewComponents, called **before** the events `popstate` and `vjs:router:popstate` are dispatched |
| onAfterLeave | <code>function</code> |  lifecycle for ViewComponents, called **after** the events `popstate` and `vjs:router:popstate` are dispatched |

#### {HTMLElement & IView } ViewComponent

#### {Object} RouterRoute
| Name | Type | Description |
| --- | --- | --- |
| location | <code>string</code> | path of the route |
| component | <code>string</code> | HTML tag of the component |

#### {RouterRoute & IResolverRoute} ResolverRoute
| Name | Type | Description |
| --- | --- | --- |
| location | <code>string</code> | path of the route |
| component | <code>string</code> | HTML tag of the component |

#### {RouterRoute & IResolverRoute} RouterLocation
| Name | Type | Description |
| --- | --- | --- |
| componentKey | <code>string</code> | path of the route |
| parameter | <code>Object.\<string, string\></code> | HTML tag of the component |
| pathname | <code>string</code> | HTML tag of the component |

#### {Object} RouterOptions
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| container | <code>HTMLElement</code> | <code>null</code> | HTMLElement utilized as container for the components |
| routes | <code>Array.\<ResolverRoute\></code> | <code>[]</code> | array of internal route objects |
| initViewsAtStart | <code>boolean</code> | <code>false</code> | initialize all view components |
| anchorScan | <code>HTMLElement</code> | <code>null</code> | HTMLElement used to scan for `HTMLAnchorElement` |
| debug | <code>boolean</code> | <code>false</code> | debug mode |

## Class: Router


VJS Router
Router for SPAs utilizing native web components

#### new Router([options])

### <a id="router-properties"></a>Properties

### <a id="router-methods"></a>Methods

### <a id="router-events"></a>Events

## ToDo
- finish readme
- create changelog
- remove _log from router.js and create a logger
- replace the quick'n'dirty JSDocs with proper ones
- implement redirects
- implement animated transitions
- add the option to pass a callback to routes which will be invoked when the view component finished its rendering process
- lazy loading
- error handling
- test in firefox and safari