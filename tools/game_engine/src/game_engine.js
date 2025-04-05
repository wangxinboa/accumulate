import { RendererType } from './game_engine_option.js';
import CanvasRenderer from './renderer/canvas_renderer.js';
import CanvasEvent from './event/canvas_event/canvas_event.js';
import ScaleManager from './scale/scale_manager.js';
import Scene from './scene/scene.js';

export default class GameEngine {
	constructor(option) {
		this.canvasEvent = new CanvasEvent(option.el, option);
		this.scene = option.scene || null;
		this.canvasEvent.bindScene(this.scene);

		this.renderer = (
			option.renderType === RendererType.canvas ?
				new CanvasRenderer(option.el, option) :
				new CanvasRenderer(option.el, option)
		);

		this.scaleManager = new ScaleManager(option.el, option);

		this._onResize = this._onResize.bind(this);
		this.scaleManager.onResize(this._onResize);
		this.scaleManager.resize();

		this.step = this.step.bind(this);
		requestAnimationFrame(this.step);
	}

	_onResize(width, height) {
		if (this.scene !== null) {
			this.scene.camera.setRange(width, height);
		}
		this.renderer.resize();
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
		this.canvasEvent.update();
		this.renderer.render(this.scene, time);

		requestAnimationFrame(this.step);
	}

	destroy() {

	}
}
