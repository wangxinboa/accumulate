import app from "./Application.js";

const ResizePlugin = {
	init(options) {
		this.resizeTo = options.resizeTo || null;
	},
	set resizeTo(dom) {
		globalThis.removeEventListener("resize", this.queueResize);
		app._resizeTo = dom;
		if (dom) {
			globalThis.addEventListener("resize", this.queueResize);
			this.resize();
		}
	},
	get resizeTo() {
		return app._resizeTo;
	},
	queueResize() {
		if (!app._resizeTo) {
			return;
		}
		this._cancelResize();
		app._resizeId = requestAnimationFrame(() => this.resize());
	},
	_cancelResize() {
		if (this._resizeId) {
			cancelAnimationFrame(this._resizeId);
			this._resizeId = null;
		}
	},
	resize() {
		if (!app._resizeTo) {
			return;
		}
		this._cancelResize();
		let width;
		let height;
		if (app._resizeTo === globalThis.window) {
			width = globalThis.innerWidth;
			height = globalThis.innerHeight;
		} else {
			const { clientWidth, clientHeight } = app._resizeTo;
			width = clientWidth;
			height = clientHeight;
		}
		app.renderer.resize(width, height);
		app.render();
	},
	destroy() {
		globalThis.removeEventListener("resize", this.queueResize);
		this._cancelResize();
		this._cancelResize = null;
		this.queueResize = null;
		app.resizeTo = null;
		this.resize = null;
	},
};

export default ResizePlugin;
