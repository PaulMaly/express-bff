const compress = require('compression');
const security = require('./middleware/security');
const session = require('./middleware/session');
const serve = require('./middleware/static');
const proxy = require('./middleware/proxy');
const sse = require('./middleware/sse');
const api = require('./middleware/api');
const ssr = require('./middleware/ssr');

module.exports = function (app, options = {}) {
    options.session !== false && session(app, options.session);
    options.security !== false && security(app, options.security);
    options.compress !== false && app.use(compress(options.compress || { threshold: 0 }));
    options.sse !== false && sse(app, options.sse);
    options.api !== false && api(app, options.api);
    options.static !== false && serve(app, options.static);
    options.ssr !== false && ssr(app, options.ssr);
    options.proxy !== false && proxy(app, options.proxy);
};