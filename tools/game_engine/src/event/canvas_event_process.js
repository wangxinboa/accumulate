

export default class CanvasEventProcess {
	constructor() {
		this._over = [];
		this._drag = [];
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

	processEnterEvents() {

	}

	processLeaveEvents() {

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