import webglRenderer from "../rendering/renderers/gl/WebGLRenderer.js";
import { Container } from "../scene/container/Container.js";
import ResizePlugin from "./ResizePlugin.js";
import { TickerPlugin } from "./TickerPlugin.js";

const app = {
	stage: new Container(),
	renderer: webglRenderer,
	async init(options) {
		this.renderer.init(options);

		ResizePlugin.init(options);
		TickerPlugin.init.call(app, options);
	},
	render() {
		this.renderer.render({ container: this.stage });
	},
	get canvas() {
		return this.renderer.canvas;
	},
	get view() {
		return this.renderer.canvas;
	},
	get screen() {
		return this.renderer.screen;
	},
};

export default app;
