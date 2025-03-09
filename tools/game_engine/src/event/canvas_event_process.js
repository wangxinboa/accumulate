import CanvasEventType from './canvas_event_type.js';

export default class CanvasEventProcess {
	constructor() {
		this._temp = null;

		this._preMoveEnter = [];
		this._nowMoveEnter = [];

		this._drag = [];
	}

	processDownEvents(x, y) {
		let visibleObject = null, hasDownEmit = false;
		for (let i = this.scene.visibleObjectCount - 1; i >= 0; i--) {
			visibleObject = this.scene.visibleObjects[i];

			if (visibleObject.hitTest(x, y)) {
				if (
					(!this.topEventOnly || !hasDownEmit) &&
					visibleObject.hasListener(CanvasEventType.mousedown)
				) {
					visibleObject.emit(CanvasEventType.mousedown, x, y);
					hasDownEmit = true;
				}
			}

			if (this.topEventOnly && hasDownEmit) {
				break;
			}
		}

		if (!hasDownEmit) {
			this.scene.emit(CanvasEventType.mousedown, x, y);
		}

		visibleObject = null;
		hasDownEmit = null;
	}


	processMoveEvents(x, y) {
		let visibleObject = null,
			hasMoveEmit = false,
			hasMoveEnterEmit = false,
			hasMoveLeaveEmit = false;

		for (let i = this.scene.visibleObjectCount - 1; i >= 0; i--) {
			visibleObject = this.scene.visibleObjects[i];

			if (visibleObject.hitTest(x, y)) {
				if (
					(!this.topEventOnly || !hasMoveEmit) &&
					visibleObject.hasListener(CanvasEventType.mousemove)
				) {
					visibleObject.emit(CanvasEventType.mousemove, x, y);
					hasMoveEmit = true;
				}

				this._nowMoveEnter.push(visibleObject);
				if (
					(!this.topEventOnly || !hasMoveEnterEmit) &&
					visibleObject.hasListener(CanvasEventType.mouseenter) &&
					!this._preMoveEnter.includes(visibleObject)
				) {
					visibleObject.emit(CanvasEventType.mouseenter, x, y);
					hasMoveEnterEmit = true;
				}
			} else {
				if (
					(!this.topEventOnly || !hasMoveLeaveEmit) &&
					visibleObject.hasListener(CanvasEventType.mouseleave) &&
					this._preMoveEnter.includes(visibleObject)
				) {
					visibleObject.emit(CanvasEventType.mouseleave, x, y);
					hasMoveLeaveEmit = true;
				}
			}

			if (this.topEventOnly && hasMoveEmit && hasMoveEnterEmit && hasMoveLeaveEmit) {
				break;
			}
		}

		this._temp = this._preMoveEnter;
		this._preMoveEnter = this._nowMoveEnter;
		this._nowMoveEnter = this._temp;

		if (!hasMoveEmit) {
			this.scene.emit(CanvasEventType.mousemove, x, y);
		}

		this._temp = null;
		this._nowMoveEnter.length = 0;

		visibleObject = null;
		hasMoveEmit = null;
		hasMoveEnterEmit = null;
		hasMoveLeaveEmit = null;
	}
	processUpEvents(x, y) {
		let visibleObject = null, hasUpEmit = false;
		for (let i = this.scene.visibleObjectCount - 1; i >= 0; i--) {
			visibleObject = this.scene.visibleObjects[i];

			if (visibleObject.hitTest(x, y)) {
				if (
					(!this.topEventOnly || !hasUpEmit) &&
					visibleObject.hasListener(CanvasEventType.mouseup)
				) {
					visibleObject.emit(CanvasEventType.mouseup, x, y);
					hasUpEmit = true;

				}
			}

			if (this.topEventOnly && hasUpEmit) {
				break;
			}
		}

		if (!hasUpEmit) {
			this.scene.emit(CanvasEventType.mouseup, x, y);
		}

		visibleObject = null;
		hasUpEmit = null;
	}

	destroy() {
		this._over = null;
		this._drag = null;
	}
}