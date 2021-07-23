# An Express middleware for simple way to create BFF (backend-for-frontend) server for your RIA/SPA applications.

## Features

- Automated client-side security.
- Built-in sessions.
- File-based REST API controllers with automatic route-matching.
- Server-sent event (SSE) support out-of-the-box.
- Automated proxying of requests to backend server.
- Easy integration with Server-side rendering (SSR) engines.
- Static files serving if needed.
- Query to SQL (QSQL) support. (coming soon)
- Memoization of response based on request params. (coming soon)
- GrapthQL integration. (coming soon)
- Websockets support. (coming soon)

## Install

```bash
npm i express-bff --save
```

## Usage

### Configuration

```javascript
const path = require('path');
const express = require('express');
const bff = require('express-bff');

const app = express();

bff(app, {
    security: {
        cors: false,
        secure,
    },
    session: {
        persist: true,
    },
    sse: {
        path: '/events',
    },
    api: {
        dir: path.join(__dirname, 'routes'),
    },
    proxy: {
        target: 'https://192.x.x.x:3030',
    },
    static: {
        dir: path.join(__dirname, 'static'),
        single: true,
        dev,
    },
});

app.listen(process.env.PORT);
```

### REST API controller

```javascript
// ./routes/posts/index.js => /posts

module.exports = {
    get,
    post,
    patch,
    put,
    delete: del
};

async function get(req, res) {
  // ...
}

async function post(req, res) {
  // ...
}

async function put(req, res) {
  // ...
}

async function patch(req, res) {
  // ...
}

async function del(req, res) {
  // ...
}
```

Route with dynamic parameters:

```javascript
// ./routes/posts/:id.js => /posts/:id

module.exports = {
    get,
    ...
};

async function get(req, res) {
  console.log('ID is ', req.params.id);
}
```
