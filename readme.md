[![GitHub license](https://img.shields.io/github/license/AndTheGodsMadeLove/vjs.svg)](https://github.com/AndTheGodsMadeLove/vjs/blob/master/LICENSE) [![GitHub tag](https://img.shields.io/github/tag/AndTheGodsMadeLove/vjs.svg)](https://GitHub.com/AndTheGodsMadeLove/vjs/tags/) ![GitHub commits](https://img.shields.io/github/commits-since/AndTheGodsMadeLove/vjs/v0.1-alpha.svg) [![GitHub contributors](https://img.shields.io/github/contributors/AndTheGodsMadeLove/vjs.svg)](https://GitHub.com/AndTheGodsMadeLove/vjs/graphs/contributors/) [![Github all releases](https://img.shields.io/github/downloads/AndTheGodsMadeLove/vjs/total.svg)](https://GitHub.com/AndTheGodsMadeLove/vjs/releases/)

# VJS
VJS aims to be a lightweight framework for native web components which can be utilized to create SPA without almost any effort. Feel free to contribute in any way, your input is highly welcome! :thumbsup:

**The project itself is in the very beginning of the development process and almost everything is missing at this point.** :thumbsdown:

## Table of Contents
-  [Getting Started - TBD](#getting-started)
- [Router](#router)
  - [Types](#types)
  - [Class: Router](#class-router)
    - [Constants](#router-constants)
    - [Properties](#router-properties)
    - [Methods](#router-methods)
    - [Events](#router-events)
  - [Class: Resolver](#class-resolver)
    - [Properties](#resolver-properties)
    - [Methods](#resolver-methods)
  - [Class: View](#class-view)
    - [Constants](#view-constants)
    - [Properties](#view-properties)
    - [Events](#view-events)
  - [Location Object](#location-object)
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
| --- | --- | --- |
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

#### new Router([RouterOptions])

### <a id="router-constants"></a>Constants

| Name | Type |
| --- | --- |
| <code>ROUTER_DEFAULT_OPTIONS</code> |<code>RouterOptions</code> |
| <code>ROUTER_EVT_CLICK</code> |<code>string</code> |
| <code>ROUTER_EVT_POPSTATE</code> |<code>string</code> |

### <a id="router-properties"></a>Properties

| Name | Access modifier | Type | Default | Description |
| --- | --- | --- | --- | --- |
| _cache | private | <code>Map.\<string, ViewComponent\></code> | <code>new Map()</code> | cache for initialized components |
| _location | private | <code>RouterLocation</code> | <code>{<br>componentKey: null,<br>parameter: {},<br>pathname: null,<br>}</code> | current state of the router |
| _options | private | <code>RouterOptions</code> || holds the configuration of the router |
| _resolver | private | <code>Resolver</code> | <code>new Resolver()</code> | VJS Resolver |

### <a id="router-methods"></a>Methods

#### getOptions()
returns current router configuration

**Returns:** <code>RouterOptions</code>

#### getRoutes()
returns configured routes

**Returns:** <code>Array.<RouterRoute></code>

#### goTo(url)
load component by url

| Name | Type |
|-|-|
| url | <code>string</code> |

**Returns:** <code>void</code>

#### removeRoute(route)
removes a route from the existing configuration

| Name | Type |
|-|-|
| route | <code>RouterRoute</code> |

**Returns:** <code>void</code>

#### removeRouteByPath(path)
remove a route from the existing configuration filtered by the path property of the route object

| Name | Type |
|-|-|
| path | <code>string</code> |

**Returns:** <code>void</code>

#### setOptions(options)
set options for router configuration

| Name | Type |
|-|-|
| path | <code>object</code> |

**Returns:** <code>void</code>

#### setRoutes(routes)
set routes for the router

| Name | Type |
|-|-|
| routes | <code>Array.\<RouterRoute\></code> |

**Returns:** <code>void</code>

#### _anchorScan(root)
performs a scan for <code>HTMLAnchorElement</code>s in the given <code>HTMLElement</code> to add event listeners

| Name | Type |
|-|-|
| root | <code>HTMLElement</code> |

**Returns:** <code>void</code>

#### _dispatchRouterEvent(type, detail)
dispatches a <code>CustomEvent</code>

| Name | Type |
|-|-|
| type |<code>string</code> |
| detail | <code>object</code> |

**Returns:** <code>void</code>

#### _displayComponent(state)
displays the requested component and updates the <code>RouterLocation</code>

| Name | Type |
|-|-|
| state | <code>RouterLocation</code> |

**Returns:** <code>void</code>

#### _getCachedComponentByKey(componentKey)
get <code>ViewComponent</code> from cache, if not already in cache the component will be initiated and pushed into the cache

| Name | Type |
|-|-|
| componentKey | <code>string</code> |

**Returns:** <code>ViewComponent</code>

#### _getLocation()
get location state

**Returns:** <code>RouterLocation</code>

#### _initComponent(componentKey)
initialize component and add it to the cache

| Name | Type |
|-|-|
| componentKey | <code>string</code> |

**Returns:** <code>void</code>

#### _onAnchorClick(e)
click handler for navigation anchor

| Name | Type |
|-|-|
| e | <code>MouseEvent</code> |

**Returns:** <code>void</code>

#### _onPopState(e)
handles the back and forward inputs from the browser

| Name | Type |
|-|-|
| e | <code>PopStateEvent</code> |

**Returns:** <code>void</code>

#### _runHookIfAvailable(component, callbackName, eventIdentifier, payload)
invokes lifecycle hook of a <code>ViewComponent</code> if available

| Name | Type |
|-|-|
| component | <code>ViewComponent</code> |
| callbackName | <code>string</code> |
| eventIdentifier | <code>string</code> |
| payload | <code>object</code> |

**Returns:** <code>void</code>

#### _setLocation(location)
sets location state

| Name | Type |
|-|-|
| location | <code>RouterLocation</code> |

**Returns:** <code>void</code>

### <a id="router-events"></a>Events

#### vjs:router:click
Emitted when the onclick handler of the router is invoked
**payload:** detail <code>{ pathname: string }</code>

#### vjs:router:popstate
Emitted when the onPopState handler of the router is invoked
**payload:** state <code>RouterLocation</code>

## Class: Resolver

VJS Resolver
Resolver utilized by VJS Router

#### new Resolver()

### <a id="resolver-properties"></a>Properties

| Name | Access modifier | Type | Default | Description |
| --- | --- | --- | --- | --- |
| _routes | private | <code>Array.\<ResolverRoute\></code> | <code>[]</code> | routes |

### <a id="resolver-methods"></a>Methods

#### getRoutes()
returns configured routes

**Returns:** <code>Array.<RouterRoute></code>

#### removeRoute(route)
removes a route from the existing configuration

| Name | Type |
|-|-|
| route | <code>RouterRoute</code> |

**Returns:** <code>void</code>

#### removeRouteByPath(path)
remove a route from the existing configuration filtered by the path property of the route object

| Name | Type |
|-|-|
| path | <code>string</code> |

**Returns:** <code>void</code>

#### resolve(pathname)
resolves pathname into its componentKey and parameters

| Name | Type |
|-|-|
| path | <code>object</code> |

**Returns:** <code>Promise</code>

#### setRoutes(routes)
set routes for the router

| Name | Type |
|-|-|
| routes | <code>Array.\<RouterRoute\></code> |

**Returns:** <code>void</code>

#### _createMatchExp(path)
returns the regular expression to perform search queries on the routes

| Name | Type |
|-|-|
| path | <code>string</code> |

**Returns:** <code>RegExp</code>

#### _createRoute(route)
returns a internal route object

| Name | Type |
|-|-|
| route | <code>RouterRoute</code> |

**Returns:** <code>ResolverRoute</code>

#### _replaceCallback(match, groupName, isOptionalModifierString)
returns a internal route object

| Name | Type |
|-|-|
| match | <code>string</code> |
| groupName | <code>string</code> |
| isOptionalModifierString | <code>string</code> |

**Returns:** <code>string</code>

## Class: View


VJS ViewComponent
ViewComponent of VJS Router, expands lifecycle and grants access the location object. This file is only used for documentation has no use in a production environment!

#### new View()

### <a id="view-constants"></a>Constants

| Name | Type |
| --- | --- |
| <code>VIEW_DEFAULT_LOCATION_STATE</code> | <code>RouterLocation</code> |
| <code>VIEW_EVT_AFTER_LEAVE</code> | <code>string</code> |
| <code>VIEW_EVT_BEFORE_LEAVE</code> | <code>string</code> |

### <a id="view-properties"></a>Properties

| Name | Access modifier | Type | Default | Description |
| --- | --- | --- | --- | --- |
| location | public | <code>RouterLocation</code> | <code>VIEW_DEFAULT_LOCATION_STATE</code> | cache for initialized components |


### <a id="view-events"></a>Events

#### vjs:view:beforeLeave
Emitted **before** the <code>popstate</code> events</code>
**payload:** detail <code>RouterLocation</code>

#### vjs:view:afterLeave
Emitted **between** the <code>popstate</code> events and the <code>disconnectedCallback</code> of the <code>ViewComponent</code>
**payload:** state <code>RouterLocation</code>

## Location Object

The Location Object is from the type <code>RouterLocation</code> and will be used as payload for events and developer will get access to the Location Object inside all <code>ViewComponents</code> with <code>this.location</code>.

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
