

export default class KeyboardManager {
	constructor(canvasEvent) {

		this.canvasEvent = canvasEvent;

		this.startListeners();

		this.onKeyDown = this.onKeyDown.bind(this);
		this.onKeyUp = this.onKeyUp.bind(this);
	}

	startListeners() {

		this.canvasEvent.el.addEventListener('keydown', this.onKeyDown, false);
		this.canvasEvent.el.addEventListener('keyup', this.onKeyUp, false);
	}

	stopListeners() {

		this.canvasEvent.el.removeEventListener('keydown', this.onKeyDown, false);
		this.canvasEvent.el.removeEventListener('keyup', this.onKeyUp, false);
	}

	onKeyDown(e) {

	}
	onKeyUp(e) {

	}

	destroy() {
		this.stopListeners();

		this.canvasEvent = null;
	}
}