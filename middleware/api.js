const methodOverride = require('method-override');
const { json, urlencoded } = require('body-parser');
const createRouter = require('express-file-routing').default;
const requestID = require('node-express-req-id');

const defaults = {
	dir: './routes',
	method: '_method',
	reqId: 'X-Request-Id',
};

module.exports = function (app, options = {}) {
	const { dir: directory, method, reqId: headerName, ...opts } = { ...defaults, ...options };

	app.use(json());
	app.use(urlencoded({ extended: true }));
	app.use(methodOverride(method));
	app.use(requestID({ type: 'uuid', headerName, }));

	createRouter(app, {
		directory,
		...opts,
	});
};
