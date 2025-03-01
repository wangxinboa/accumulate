
export default class MouseManager {
	constructor(canvasEvent) {

		this.canvasEvent = canvasEvent;

		this.startListeners();
	}

	startListeners() {
		this.canvasEvent.el.addEventListener('mousedown', this.canvasEvent.event);
		this.canvasEvent.el.addEventListener('mousemove', this.canvasEvent.event);
		this.canvasEvent.el.addEventListener('mouseup', this.canvasEvent.event);
		this.canvasEvent.el.addEventListener('mouseenter', this.canvasEvent.event);
		this.canvasEvent.el.addEventListener('mouseleave', this.canvasEvent.event);
		this.canvasEvent.el.addEventListener('wheel', this.canvasEvent.event, { passive: true });
	}

	stopListeners() {
		this.canvasEvent.el.removeEventListener('mousedown', this.canvasEvent.event);
		this.canvasEvent.el.removeEventListener('mousemove', this.canvasEvent.event);
		this.canvasEvent.el.removeEventListener('mouseup', this.canvasEvent.event);
		this.canvasEvent.el.removeEventListener('mouseenter', this.canvasEvent.event);
		this.canvasEvent.el.removeEventListener('mouseleave', this.canvasEvent.event);
		this.canvasEvent.el.removeEventListener('wheel', this.canvasEvent.event);
	}

	destroy() {
		this.stopListeners();

		this.canvasEvent = null;
	}
}