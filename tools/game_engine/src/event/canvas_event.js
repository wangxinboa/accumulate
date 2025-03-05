import CanvasEventProcess from './canvas_event_process.js';
import MouseManager from './mouse/mouse_manager.js';
import CanvasEventType from './canvas_event_type.js';
import Vector2 from '../math/vector2.js';

const _vector2 = new Vector2();
export default class CanvasEvent extends CanvasEventProcess {
	constructor(el) {
		super();

		this.el = el;

		this.execute = this.execute.bind(this);
		this.scene = null;

		this.mouseManager = new MouseManager(this);
	}

	execute(e) {
		_vector2.set(e.offsetX, e.offsetY).applyMatrix3(this.scene.camera.matrixWorldInvert);

		let visibleObject = null, hasEmit = false;
		for (let i = this.scene.visibleObjectCount - 1; i >= 0; i--) {
			visibleObject = this.scene.visibleObjects[i];

			if (visibleObject.hitTest(_vector2.x, _vector2.y)) {
				if (e.type === CanvasEventType.mousedown) {
					if (visibleObject.hasListener(CanvasEventType.mousedown)) {
						hasEmit = true;
						this.processDownEvents(visibleObject, e, _vector2.x, _vector2.y);
					}
				} else if (e.type === CanvasEventType.mousemove) {
					if (visibleObject.hasListener(CanvasEventType.mousemove)
					) {
						hasEmit = true;
						this.processMoveEvents(visibleObject, e, _vector2.x, _vector2.y);
					}
					if (
						visibleObject.hasListener(CanvasEventType.mouseenter) ||
						visibleObject.hasListener(CanvasEventType.mouseleave)
					) {
						hasEmit = true;

					}
				} else if (e.type === CanvasEventType.mouseup) {
					if (visibleObject.hasListener(CanvasEventType.mouseup)) {
						hasEmit = true;
						this.processUpEvents(visibleObject, e, _vector2.x, _vector2.y);
					}
				}
			}
		}

		if (!hasEmit) {
			this.scene.emit(e.type, e, _vector2.x, _vector2.y);
		}

		visibleObject = null;
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