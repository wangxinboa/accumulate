import { KeyDownFlags, KeyUpFlags, KeyPressFlags } from './key_flags.js';

let _pressedKeyIndex_ = 0;

export default class KeyboardManager {
	constructor(canvasEvent) {

		this.canvasEvent = canvasEvent;

		this.onKeyDown = this.onKeyDown.bind(this);
		this.onKeyUp = this.onKeyUp.bind(this);

		this.pressedKeys = [];
		this.pressedKeyFlags = {};

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

	// 判断键是否被按下
	isKeyPressed(key) {
		return this.pressedKeyFlags[key] === true;
	}
	// 标记键为按下状态
	setKeyPressed(key) {
		if (!this.pressedKeyFlags[key]) {
			this.pressedKeys.push(key);
			this.pressedKeyFlags[key] = true;
		}
	}
	// 移除键的按下标记
	releaseKey(key) {
		_pressedKeyIndex_ = this.pressedKeys.indexOf(key);
		if (_pressedKeyIndex_ > -1) {
			this.pressedKeys.splice(_pressedKeyIndex_, 1);
		}
		this.pressedKeyFlags[key] = false;
	}

	onKeyDown(e) {
		this.setKeyPressed(KeyPressFlags[e.keyCode]);
		this.canvasEvent.scene.emit(KeyDownFlags[e.keyCode], e);
	}
	onKeyUp(e) {
		this.releaseKey(KeyPressFlags[e.keyCode]);
		this.canvasEvent.scene.emit(KeyUpFlags[e.keyCode], e);
	}
	update() {
		for (let i = 0, len = this.pressedKeys.length; i < len; i++) {
			this.canvasEvent.scene.emit(this.pressedKeys[i]);
		}
	}

	destroy() {
		this.stopListeners();

		this.canvasEvent =

			this.onKeyDown =
			this.onKeyUp =

			this.pressedKeys =
			this.pressedKeyFlags = null;

		delete this.canvasEvent;

		delete this.onKeyDown;
		delete this.onKeyUp;

		delete this.pressedKeys;
		delete this.pressedKeyFlags;
	}
}