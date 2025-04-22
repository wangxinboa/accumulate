import { RendererType } from './game_engine_option.js';
import CanvasRenderer from './renderer/canvas_renderer/canvas_renderer.js';
import WebGLRenderer from './renderer/webgl_renderer/webgl_renderer.js';
import CanvasEvent from './event/canvas_event/canvas_event.js';
import ScaleManager from './scale/scale_manager.js';
import Scene from './scene/scene.js';

import StatsTool from './third_party_tools/stats.js';

export default class GameEngine {
	constructor(option) {
		this.canvasEvent = new CanvasEvent(option.el, option);
		this.scene = option.scene || null;
		this.canvasEvent.bindScene(this.scene);

		this.renderer =
			option.renderType === RendererType.webgl ?
				new WebGLRenderer(option.el, option) :
				option.renderType === RendererType.canvas ?
					new CanvasRenderer(option.el, option) :
					new WebGLRenderer(option.el, option);

		this.scaleManager = new ScaleManager(option.el, option);

		this._onResize = this._onResize.bind(this);
		this.scaleManager.onResize(this._onResize);
		this.scaleManager.resize();

		this.beforeUpdate = option.beforeUpdate || null;
		this.step = this.step.bind(this);
		requestAnimationFrame(this.step);

		StatsTool.init();
	}

	_onResize(width, height, retinaScaling) {
		if (this.scene !== null) {
			this.scene.camera.setRange(width, height);
		}
		this.renderer.resize(width, height, retinaScaling);
	}

	changeScene(scene) {
		this.scene = scene;
		this.canvasEvent.bindScene(scene);

		if (scene instanceof Scene) {
			scene.camera.setRange(this.scaleManager.width, this.scaleManager.height);
		}

		return this;
	}

	step(time = 0) {
		if (this.beforeUpdate) {
			this.beforeUpdate(time);
		}

		StatsTool.update();

		this.canvasEvent.update();
		this.renderer.render(this.scene, time);

		requestAnimationFrame(this.step);
	}

	destroy() {

	}
}
