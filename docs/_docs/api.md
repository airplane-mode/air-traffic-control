---
title: API
permalink: /docs/api/
redirect_from: /docs/api.html
---

## API

<!-- BEGIN DOC-COMMENT H3 src/index.js -->
### `constructor(store, config =`

Creates a new router, given a reference to the redux store for action dispatch 


**Parameters:**

* `store` — object — Your redux store.
* `config` — object — Additional configuration parameters. Currently only supports the interceptLinks property.

### `route(pathOrPaths, handler)`

Registers a new route. 


**Parameters:**

* `pathOrPaths` — string — (Optionally an array of strings) The path of paths that will trigger the handler. A path can be of the form /foo/{bar}/{baz} to match the bar param and baz param.
* `handler` — string — A handler that takes the params matched in the URL ((bar, baz) => { } for the example above), and returns a Redux action.

### `navigate(path, handler = () =>`

Searches for a matching path, and if it finds one, runs the associated handlers. 


**Parameters:**

* `path` — string — The path to which to navigate.
* `handler` — object — (Optional) An additional handler to run after the standard handler does its thing.

### `prettify(path, title)`

Updates the path and, optionally, the title of the page without firing any handlers. This will be a purely aesthetic update to the location, and won't affect navigation / history. 

*** Disabled eslint rule that tries to force this to be static because the router should be singleton. 
**Parameters:**

* `path` — string — The new path.
* `title` — string — (Optional) The new title.

### `start()`

Starts the router and begins listening for actions and navigation changes. 


<!-- END DOC-COMMENT -->
