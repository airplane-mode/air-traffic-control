# Air Traffic Control

Dead simple redux routing, the way it should work.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Air Traffic Control](#air-traffic-control)
  - [How it works](#how-it-works)
  - [Installation](#installation)
  - [Usage](#usage)
  - [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## How it works

Air Traffic Control maps route changes in your app to action creators in redux.

## Installation

```bash
$ npm install --save air-traffic-control
```

## Usage

```javascript
const Router = require('air-traffic-control');

// import your action creators
const ACTION_CREATORS = require('./actions').ACTION_CREATORS;

// import your redux store
const store = require('./store');

// initialize the router
// if you want local links to be automatically fed into the router,
// pass the interceptLinks: true option.
// This means you can right local links with <a href="/foo"> and they'll just work.
const router = new Router(store, { interceptLinks: true }); // TODO: interceptLinks true as default?

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

## License
>You can check out the full license [here](https://github.com/airplane-mode/air-traffic-control/blob/master/LICENSE)

This project is licensed under the terms of the **MIT** license.
