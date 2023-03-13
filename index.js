const compress = require('compression');
const security = require('./middleware/security');
const session = require('./middleware/session');
const serve = require('./middleware/static');
const proxy = require('./middleware/proxy');
const sse = require('./middleware/sse');
const api = require('./middleware/api');
const ssr = require('./middleware/ssr');

module.exports = function bff(app, options = {}) {
	options.compress !== false && app.use(compress(options.compress || { threshold: 0 }));
	options.static !== false && serve(app, options.static);
	options.session !== false && session(app, options.session);
	options.security !== false && security(app, options.security);
	options.sse !== false && sse(app, options.sse);
	options.middlewares && options.middlewares.forEach((middleware) => app.use(middleware));
	options.api !== false && api(app, options.api);
	options.proxy !== false && proxy(app, options.proxy);
	options.ssr !== false && ssr(app, options.ssr);
};
