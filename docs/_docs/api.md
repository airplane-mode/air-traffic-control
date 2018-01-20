---
title: API
permalink: /docs/api/
redirect_from: /docs/api.html
---

## API

<!-- BEGIN DOC-COMMENT H3 src/index.js -->
### `constructor(store, config =`

Creates a new router, given a reference to the redux store for action dispatch 

                         Currently only supports the interceptLinks property.

**Parameters:**

* `store` — object — Your redux store.
* `config` — object — Additional configuration parameters.

### `route(pathOrPaths, handler)`

Registers a new route. 

                               The path of paths that will trigger the handler.
                               A path can be of the form /foo/{bar}/{baz} to match
                               the bar param and baz param.
                           ((bar, baz) => { } for the example above),
                           and returns a Redux action.

**Parameters:**

* `pathOrPaths` — string — (Optionally an array of strings)
* `handler` — string — A handler that takes the params matched in the URL

### `navigate(path, handler = () =>`

Searches for a matching path, and if it finds one, runs the associated handlers. 


**Parameters:**

* `path` — string — The path to which to navigate.
* `handler` — object — (Optional) An additional handler to run after the standard handler.

### `prettify(path, title)`

Updates the path and, optionally, the title of the page without firing any handlers. This will be a purely aesthetic update to the location, and won't affect navigation / history. 


**Parameters:**

* `path` — string — The new path.
* `title` — string — (Optional) The new title.

### `start()`

Starts the router and begins listening for actions and navigation changes. 


<!-- END DOC-COMMENT -->
