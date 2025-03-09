import CanvasEventType from './canvas_event_type.js';

export default class CanvasEventProcess {
	constructor() {
		this._temp = null;

		this._preMoveEnter = [];
		this._nowMoveEnter = [];

		this._drag = [];
	}

	processDownEvents(x, y) {
		let visibleObject = null,
			hasDownEmit = false;

		for (let i = this.scene.visibleObjectCount - 1; i >= 0; i--) {
			visibleObject = this.scene.visibleObjects[i];

			if (visibleObject.hitTest(x, y)) {
				if (
					(!this.topEventOnly || !hasDownEmit) &&
					visibleObject.hasEvent(CanvasEventType.pointerdown)
				) {
					visibleObject.emit(CanvasEventType.pointerdown, x, y);
					hasDownEmit = true;
				}
			}

			if (this.topEventOnly && hasDownEmit) {
				break;
			}
		}

		if (!hasDownEmit) {
			this.scene.emit(CanvasEventType.pointerdown, x, y);
		}
		this.scene.directEvent.emit(CanvasEventType.pointerdown, x, y);

		visibleObject =
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
					visibleObject.hasEvent(CanvasEventType.pointermove)
				) {
					visibleObject.emit(CanvasEventType.pointermove, x, y);
					hasMoveEmit = true;
				}

				this._nowMoveEnter.push(visibleObject);
				if (
					(!this.topEventOnly || !hasMoveEnterEmit) &&
					visibleObject.hasEvent(CanvasEventType.pointerenter) &&
					!this._preMoveEnter.includes(visibleObject)
				) {
					visibleObject.emit(CanvasEventType.pointerenter, x, y);
					hasMoveEnterEmit = true;
				}
			} else {
				if (
					(!this.topEventOnly || !hasMoveLeaveEmit) &&
					visibleObject.hasEvent(CanvasEventType.pointerleave) &&
					this._preMoveEnter.includes(visibleObject)
				) {
					visibleObject.emit(CanvasEventType.pointerleave, x, y);
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
			this.scene.emit(CanvasEventType.pointermove, x, y);
		}
		this.scene.directEvent.emit(CanvasEventType.pointermove, x, y);

		this._nowMoveEnter.length = 0;
		this._temp =
			visibleObject =
			hasMoveEmit =
			hasMoveEnterEmit =
			hasMoveLeaveEmit = null;
	}
	processUpEvents(x, y) {
		let visibleObject = null, hasUpEmit = false;
		for (let i = this.scene.visibleObjectCount - 1; i >= 0; i--) {
			visibleObject = this.scene.visibleObjects[i];

			if (visibleObject.hitTest(x, y)) {
				if (
					(!this.topEventOnly || !hasUpEmit) &&
					visibleObject.hasEvent(CanvasEventType.pointerup)
				) {
					visibleObject.emit(CanvasEventType.pointerup, x, y);
					hasUpEmit = true;

				}
			}

			if (this.topEventOnly && hasUpEmit) {
				break;
			}
		}

		if (!hasUpEmit) {
			this.scene.emit(CanvasEventType.pointerup, x, y);
		}
		this.scene.directEvent.emit(CanvasEventType.pointerup, x, y);

		visibleObject =
			hasUpEmit = null;
	}

	destroy() {
		this._over =
			this._drag = null;
	}
}