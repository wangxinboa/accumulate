import CanvasEventProcess from './canvas_event_process.js';
import MouseManager from './mouse/mouse_manager.js';


export default class CanvasEvent extends CanvasEventProcess {
	constructor(el) {
		super();

		this.el = el;

		this.execute = this.execute.bind(this);
		this.scene = null;

		this.mouseManager = new MouseManager(this);
	}

	bindScene(scene) {
		this.scene = scene;
	}

	destroy() {
		super.destroy();

		this.mouseManager.destroy();
		this.mouseManager = null;

		this.el = null;
		this.execute = null;

		this.scene = null;
	}
}