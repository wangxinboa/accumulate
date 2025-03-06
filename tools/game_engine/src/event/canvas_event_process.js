import CanvasEventType from './canvas_event_type.js';
import Vector2 from '../math/vector2.js';


const _vector2 = new Vector2();

export default class CanvasEventProcess {
	constructor() {
		this._temp = null;

		this._preMove = [];
		this._nowMove = [];

		this._drag = [];
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
					this._nowMove.push(visibleObject);

					if (visibleObject.hasListener(CanvasEventType.mousemove)) {
						hasEmit = true;
						this.processMoveEvents(visibleObject, e, _vector2.x, _vector2.y);
					}

					if (
						visibleObject.hasListener(CanvasEventType.mouseenter) &&
						!this._preMove.includes(visibleObject)
					) {
						this.processEnterEvents(visibleObject, e);
						hasEmit = true;
					}
				} else if (e.type === CanvasEventType.mouseup) {
					if (visibleObject.hasListener(CanvasEventType.mouseup)) {
						hasEmit = true;
						this.processUpEvents(visibleObject, e, _vector2.x, _vector2.y);
					}
				}
			} else {
				if (e.type === CanvasEventType.mousemove) {
					if (
						visibleObject.hasListener(CanvasEventType.mouseleave) &&
						this._preMove.includes(visibleObject)
					) {
						this.processLeaveEvents(visibleObject, e);
					}
				}
			}
		}

		this._temp = this._preMove;
		this._preMove = this._nowMove;
		this._nowMove = this._temp;

		this._temp = null;
		this._nowMove.length = 0;

		if (!hasEmit) {
			this.scene.emit(e.type, e, _vector2.x, _vector2.y);
		}

		visibleObject = null;
	}

	processDownEvents(visibleObject, e, x, y) {
		return visibleObject.emit(e.type, e, x, y);
	}

	processMoveEvents(visibleObject, e, x, y) {
		return visibleObject.emit(e.type, e, x, y);
	}

	processUpEvents(visibleObject, e, x, y) {
		return visibleObject.emit(e.type, e, x, y);
	}

	processEnterEvents(visibleObject, e) {
		return visibleObject.emit(CanvasEventType.mouseenter, e);
	}

	processLeaveEvents(visibleObject, e) {
		return visibleObject.emit(CanvasEventType.mouseleave, e);
	}

	processDragDownEvent() {

	}

	processDragDownEvent() {

	}

	processDragMoveEvent() {

	}

	processWheelEvent() {

	}

	destroy() {
		this._over = null;
		this._drag = null;
	}
}