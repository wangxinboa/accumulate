import MouseManager from './mouse/mouse_manager.js';

export default class CanvasEvent {
	constructor(el) {
		this.el = el;

		this.event = this.event.bind(this);
		this.scene = null;

		this.mouseManager = new MouseManager(this);
	}

	event(e) {
		let hasEmit = false;
		for (let i = this.scene.visibleObjectCount - 1; i >= 0; i--) {
			if (hasEmit) {
				break;
			} else {
				hasEmit = this.scene.visibleObjects[i].emit(e.type, e, this.scene.camera);
			}
		}
		if (!hasEmit) {
			this.scene.emit(e.type, e, this.scene.camera);
		}
		hasEmit = null;
	}

	bindScene(scene) {
		this.scene = scene;
	}

	destroy() {
		this.mouseManager.destroy();
		this.mouseManager = null;

		this.el = null;
		this.event = null;

		this.scene = null;
	}
}