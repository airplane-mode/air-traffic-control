---
title: Quick Start
permalink: /docs/home/
redirect_from: /docs/index.html
---

## Installation

Use npm:

```
npm install air-traffic-control --save
```

Or download the standalone <a target='_parent' href="#">Development</a>, <a target='_parent' href="#">Minified</a>, or <a target='_parent' href="#">Minified and compressed</a> file and include in your header:

```
<script scr="/javascripts/air-traffic-control.js"></script>
```

## Basic Usage
```
import { Router } from "air-traffic-control";

// import your action creators
const ACTION_CREATORS = require('./actions').ACTION_CREATORS;

// import your redux store
const store = require('./store');

// initialize the router
const router = new Router(store, { interceptLinks: true });

// register any routes you want
router.route('/home', () => ACTION_CREATORS.goHome());

// route params are provided as arguments to your handler, they go in {these}
router.route('/search/{query}', (query) => ACTION_CREATORS.search(query));

// if you want more control, you can use regexes in your routes
// matched groups are passed to your handler in order
// this one matches: /trip/chicago-to-vegas/username/2017/09/01/{id}
router.route(/^\/trip\/(?:[-a-zA-Z0-9()']+\/){5}([-a-zA-Z0-9_]+)$/, (id) => ACTION_CREATORS.trip(id));

// you'll probably want a default / 404 handler
router.route(':rest:*', () => ACTION_CREATORS.notFound());

// once you're all set and you want to start routing, call:
router.start();
```


