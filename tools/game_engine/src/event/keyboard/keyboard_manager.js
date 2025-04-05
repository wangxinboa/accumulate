import { KeyDownMap, KeyUpMap } from './key_map.js';

export default class KeyboardManager {
	constructor(canvasEvent) {

		this.canvasEvent = canvasEvent;

		this.onKeyDown = this.onKeyDown.bind(this);
		this.onKeyUp = this.onKeyUp.bind(this);

		this.startListeners();
	}

	startListeners() {
		window.addEventListener('keydown', this.onKeyDown, false);
		window.addEventListener('keyup', this.onKeyUp, false);
	}

	stopListeners() {
		window.removeEventListener('keydown', this.onKeyDown, false);
		window.removeEventListener('keyup', this.onKeyUp, false);
	}

	onKeyDown(e) {
		this.canvasEvent.scene.emit(KeyDownMap[e.keyCode], e);
	}
	onKeyUp(e) {
		this.canvasEvent.scene.emit(KeyUpMap[e.keyCode], e);
	}

	destroy() {
		this.stopListeners();

		this.canvasEvent =

			this.onKeyDown =
			this.onKeyUp = null;

		delete this.canvasEvent;

		delete this.onKeyDown;
		delete this.onKeyUp;
	}
}