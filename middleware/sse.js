const EventEmitter = require('events').EventEmitter;

class SSE extends EventEmitter {
	constructor(options = {}) {
		super();
		this.options = options;
		this.init = this.init.bind(this);
	}

	init(req, res) {
		let _id = 0;

		const { headers, statusCode, compress, retry } = this.options;

		req.socket.setTimeout(0);
		req.socket.setNoDelay(true);
		req.socket.setKeepAlive(true);
		res.statusCode = statusCode;

		Object.entries(headers).forEach(([name, value]) => {
			res.setHeader(name, value);
		});

		res.setHeader('Content-Type', 'text/event-stream');
		res.setHeader('Cache-Control', 'no-cache');
		res.setHeader('X-Accel-Buffering', 'no');

		if (req.httpVersion !== '2.0') {
			res.setHeader('Connection', 'keep-alive');
		}
		if (compress) {
			res.setHeader('Content-Encoding', 'deflate');
		}

		this.setMaxListeners(this.getMaxListeners() + 1);

		const dataListener = ({ filter = 'all', data, event, id }) => {
			if (typeof filter !== 'function' && filter !== 'all') {
				throw new Error('Filter function filtering on req');
			}

			if (filter !== 'all' && !filter(req)) return;

			if (retry) {
				res.write(`retry: ${retry}\n`);
			}

			if (id) {
				res.write(`id: ${id}\n`);
			} else {
				res.write(`id: ${_id++}\n`);
			}

			if (event) {
				res.write(`event: ${event}\n`);
			}

			data = typeof data === 'object' ? JSON.stringify(data) : data;

			res.write(`data: ${data}\n\n`);
	
			res.flush();
		};

		this.on('data', dataListener);
		req.once('close', () => {
			this.removeListener('data', dataListener);
			this.setMaxListeners(this.getMaxListeners() - 1);
		});
	}

	send(filter, data, event, id) {
		this.emit('data', { filter, data, event, id });
	}
}

const defaults = {
	path: '/data',
	retry: 2000,
	statusCode: 200,
	headers: {},
	compress: false,
};

module.exports = function (app, options = {}) {
	const { path, ...opts } = { ...defaults, ...options };

	const sse = new SSE(opts);

	app.get(path, sse.init);

	app.use((req, res, next) => {
		res.sse = sse;
		return next();
	});
};
