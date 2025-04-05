
export default class MouseManager {
	constructor(canvasEvent) {

		this.canvasEvent = canvasEvent;

		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.onMouseEnter = this.onMouseEnter.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
		this.onMouseWheel = this.onMouseWheel.bind(this);

		this.startListeners();
	}

	onMouseDown(e) {
		this.canvasEvent.processDownEvents(e);
	}
	onMouseMove(e) {
		this.canvasEvent.processMoveEvents(e);
	}
	onMouseUp(e) {
		this.canvasEvent.processUpEvents(e);
	}
	onMouseEnter(e) {

	}
	onMouseLeave(e) {

	}
	onMouseWheel(e) {
		this.canvasEvent.processWheelEvents(e);
	}

	startListeners() {
		this.canvasEvent.el.addEventListener('mousedown', this.onMouseDown);
		this.canvasEvent.el.addEventListener('mousemove', this.onMouseMove);
		this.canvasEvent.el.addEventListener('mouseup', this.onMouseUp);
		this.canvasEvent.el.addEventListener('mouseenter', this.onMouseEnter);
		this.canvasEvent.el.addEventListener('mouseleave', this.onMouseLeave);
		this.canvasEvent.el.addEventListener('wheel', this.onMouseWheel, { passive: true });
	}

	stopListeners() {
		this.canvasEvent.el.removeEventListener('mousedown', this.onMouseDown);
		this.canvasEvent.el.removeEventListener('mousemove', this.onMouseMove);
		this.canvasEvent.el.removeEventListener('mouseup', this.onMouseUp);
		this.canvasEvent.el.removeEventListener('mouseenter', this.onMouseEnter);
		this.canvasEvent.el.removeEventListener('mouseleave', this.onMouseLeave);
		this.canvasEvent.el.removeEventListener('wheel', this.onMouseWheel);
	}

	destroy() {
		this.stopListeners();

		this.canvasEvent =

			this.onMouseDown =
			this.onMouseMove =
			this.onMouseUp =
			this.onMouseEnter =
			this.onMouseLeave =
			this.onMouseWheel = null;

		delete this.canvasEvent;
		delete this.onMouseDown;
		delete this.onMouseMove;
		delete this.onMouseUp;
		delete this.onMouseEnter;
		delete this.onMouseLeave;
		delete this.onMouseWheel;
	}
}