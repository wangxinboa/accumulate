import CanvasEventType from './canvas_event_type.js';
import KeyboardManager from '../keyboard/keyboard_manager.js';
import MouseManager from '../mouse/mouse_manager.js';
import Vector2 from '../../math/vector2.js';

export const _originalPoint = new Vector2();
export const _point = new Vector2();

export default class CanvasEvent {
	constructor(el, options = {}) {
		this.el = el;

		this.topEventOnly = options.topEventOnly || true;

		this.scene = null;

		this.keyboardManager = new KeyboardManager(this);
		this.mouseManager = new MouseManager(this);

		if ('ontouchstart' in document.documentElement || (navigator.maxTouchPoints && navigator.maxTouchPoints >= 1)) {
			this.touchManager = new TouchManager(this);
		}

		this._tempMoveEnter = null;

		this._preMoveEnter = [];
		this._nowMoveEnter = [];

		this._drag = [];
	}

	bindScene(scene) {
		this.scene = scene;
	}

	update() {
		this.keyboardManager.update();
	}

	processDownEvents(e) {
		_originalPoint.set(e.offsetX, e.offsetY);
		_point.set(e.offsetX, e.offsetY).applyMatrix3(this.scene.camera.matrixWorldInvert);

		let visibleObject = null,
			hasDownEmit = false;

		for (let i = this.scene.visibleObjectCount - 1; i >= 0; i--) {
			visibleObject = this.scene.visibleObjects[i];

			if (visibleObject.hitTest(_point.x, _point.y)) {
				if (
					(!this.topEventOnly || !hasDownEmit) &&
					visibleObject.hasEvent(CanvasEventType.pointerdown)
				) {
					visibleObject.emit(CanvasEventType.pointerdown, _point.x, _point.y);
					hasDownEmit = true;
				}
			}

			if (this.topEventOnly && hasDownEmit) {
				break;
			}
		}

		if (!hasDownEmit) {
			this.scene.emit(CanvasEventType.pointerdown, _point.x, _point.y);
		}
		this.scene.directEvent.emit(CanvasEventType.pointerdown, _point.x, _point.y);

		visibleObject =
			hasDownEmit = null;
	}
	processMoveEvents(e) {
		_originalPoint.set(e.offsetX, e.offsetY);
		_point.set(e.offsetX, e.offsetY).applyMatrix3(this.scene.camera.matrixWorldInvert);

		let visibleObject = null,
			hasMoveEmit = false,
			hasMoveEnterEmit = false,
			hasMoveLeaveEmit = false;

		for (let i = this.scene.visibleObjectCount - 1; i >= 0; i--) {
			visibleObject = this.scene.visibleObjects[i];

			if (visibleObject.hitTest(_point.x, _point.y)) {
				if (
					(!this.topEventOnly || !hasMoveEmit) &&
					visibleObject.hasEvent(CanvasEventType.pointermove)
				) {
					visibleObject.emit(CanvasEventType.pointermove, _point.x, _point.y);
					hasMoveEmit = true;
				}

				this._nowMoveEnter.push(visibleObject);
				if (
					(!this.topEventOnly || !hasMoveEnterEmit) &&
					visibleObject.hasEvent(CanvasEventType.pointerenter) &&
					!this._preMoveEnter.includes(visibleObject)
				) {
					visibleObject.emit(CanvasEventType.pointerenter, _point.x, _point.y);
					hasMoveEnterEmit = true;
				}
			} else {
				if (
					(!this.topEventOnly || !hasMoveLeaveEmit) &&
					visibleObject.hasEvent(CanvasEventType.pointerleave) &&
					this._preMoveEnter.includes(visibleObject)
				) {
					visibleObject.emit(CanvasEventType.pointerleave, _point.x, _point.y);
					hasMoveLeaveEmit = true;
				}
			}

			if (this.topEventOnly && hasMoveEmit && hasMoveEnterEmit && hasMoveLeaveEmit) {
				break;
			}
		}

		this._tempMoveEnter = this._preMoveEnter;
		this._preMoveEnter = this._nowMoveEnter;
		this._nowMoveEnter = this._tempMoveEnter;

		if (!hasMoveEmit) {
			this.scene.emit(CanvasEventType.pointermove, _point.x, _point.y);
		}
		this.scene.directEvent.emit(CanvasEventType.pointermove, _point.x, _point.y);

		this._nowMoveEnter.length = 0;

		this._tempMoveEnter =
			visibleObject =
			hasMoveEmit =
			hasMoveEnterEmit =
			hasMoveLeaveEmit = null;
	}
	processUpEvents(e) {
		_originalPoint.set(e.offsetX, e.offsetY);
		_point.set(e.offsetX, e.offsetY).applyMatrix3(this.scene.camera.matrixWorldInvert);

		let visibleObject = null, hasUpEmit = false;
		for (let i = this.scene.visibleObjectCount - 1; i >= 0; i--) {
			visibleObject = this.scene.visibleObjects[i];

			if (visibleObject.hitTest(_point.x, _point.y)) {
				if (
					(!this.topEventOnly || !hasUpEmit) &&
					visibleObject.hasEvent(CanvasEventType.pointerup)
				) {
					visibleObject.emit(CanvasEventType.pointerup, _point.x, _point.y);
					hasUpEmit = true;

				}
			}

			if (this.topEventOnly && hasUpEmit) {
				break;
			}
		}

		if (!hasUpEmit) {
			this.scene.emit(CanvasEventType.pointerup, _point.x, _point.y);
		}
		this.scene.directEvent.emit(CanvasEventType.pointerup, _point.x, _point.y);

		visibleObject =
			hasUpEmit = null;
	}
	processWheelEvents(e) {
		_originalPoint.set(e.offsetX, e.offsetY);
		_point.set(e.offsetX, e.offsetY).applyMatrix3(this.scene.camera.matrixWorldInvert);

		this.scene.emit(e.type, e.deltaX, e.deltaY, e.deltaZ, _point.x, _point.y);
	}

	destroy() {
		super.destroy();

		if (this.keyboardManager !== null) {
			this.keyboardManager.destroy();
			this.keyboardManager = null;
		}

		if (this.mouseManager !== null) {
			this.mouseManager.destroy();
			this.mouseManager = null;
		}

		if (this.touchManager !== null) {
			this.touchManager.destroy();
			this.touchManager = null;
		}

		this.el = null;
		this.execute = null;

		this.scene = null;
	}
}