const compress = require('compression');
const security = require('./middleware/security');
const session = require('./middleware/session');
const serve = require('./middleware/static');
const proxy = require('./middleware/proxy');
const sse = require('./middleware/sse');
const api = require('./middleware/api');
const ssr = require('./middleware/ssr');

module.exports = function (app, options = {}) {
    options.security !== false && security(app, options.security);
    options.compress !== false && app.use(compress(options.compress || { threshold: 0 }));
    options.session !== false && session(app, options.session);
    options.sse !== false && sse(app, options.sse);
    options.middlewares && options.middlewares.forEach(middleware => app.use(middleware));
    options.api !== false && api(app, options.api);
    options.proxy !== false && proxy(app, options.proxy);
    options.static !== false && serve(app, options.static);
    options.ssr !== false && ssr(app, options.ssr);
};