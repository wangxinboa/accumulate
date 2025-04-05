import { KeyDownMap, KeyUpMap, KeyPressMap } from './key_map.js';

export default class KeyboardManager {
	constructor(canvasEvent) {

		this.canvasEvent = canvasEvent;

		this.onKeyDown = this.onKeyDown.bind(this);
		this.onKeyUp = this.onKeyUp.bind(this);

		this.activeKeyPress = [];

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
		const keypressCode = KeyPressMap[e.keyCode];
		if (
			this.canvasEvent.scene.hasEvent(KeyPressMap[e.keyCode]) &&
			!this.activeKeyPress.includes(keypressCode)
		) {
			this.activeKeyPress.push(KeyPressMap[e.keyCode]);
		}
		this.canvasEvent.scene.emit(KeyDownMap[e.keyCode], e);
	}
	onKeyUp(e) {
		const index = this.activeKeyPress.indexOf(KeyPressMap[e.keyCode]);
		if (index > -1) {
			this.activeKeyPress.splice(index, 1);
		}
		this.canvasEvent.scene.emit(KeyUpMap[e.keyCode], e);
	}
	update() {
		for (let i = 0, len = this.activeKeyPress.length; i < len; i++) {
			this.canvasEvent.scene.emit(this.activeKeyPress[i]);
		}
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