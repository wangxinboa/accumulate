import { BaseCleanUp } from "./base_class/base_clean_up.js";

/**
 * 键盘事件管理类
 * 封装键盘按键状态监听与回调管理
 * @extends BaseCleanUp
 */
export class Keyboard extends BaseCleanUp {
	/**
	 * @param {EventTarget} [target=window] - 监听键盘事件的 DOM 元素，默认为 window
	 */
	constructor(target = window) {
		super();

		/** @private @type {EventTarget} */
		this._target = target;
		/** @private @type {Record<string, boolean>} 按键按下状态 */
		this._keyState = {};
		/** @private @type {Array<function(KeyboardEvent): void>} keydown 回调列表 */
		this._keyDownCallbacks = [];
		/** @private @type {Array<function(KeyboardEvent): void>} keyup 回调列表 */
		this._keyUpCallbacks = [];

		this.processKeyDownEvents = this.processKeyDownEvents.bind(this);
		this.processKeyUpEvents = this.processKeyUpEvents.bind(this);

		this._target.addEventListener("keydown", this.processKeyDownEvents);
		this._target.addEventListener("keyup", this.processKeyUpEvents);
	}

	/**
	 * 内部 keydown 事件处理
	 * @private
	 * @param {Event} event - 原生 DOM 事件
	 */
	processKeyDownEvents(event) {
		// 将 Event 转换为 KeyboardEvent，以访问 key 等属性
		const keyboardEvent = /** @type {KeyboardEvent} */ (event);
		this._keyState[keyboardEvent.key] = true;
		for (let i = 0, len = this._keyDownCallbacks.length; i < len; i++) {
			this._keyDownCallbacks[i](keyboardEvent);
		}
	}

	/**
	 * 内部 keyup 事件处理
	 * @private
	 * @param {Event} event - 原生 DOM 事件
	 */
	processKeyUpEvents(event) {
		const keyboardEvent = /** @type {KeyboardEvent} */ (event);
		this._keyState[keyboardEvent.key] = false;
		for (let i = 0, len = this._keyUpCallbacks.length; i < len; i++) {
			this._keyUpCallbacks[i](keyboardEvent);
		}
	}

	/**
	 * 查询指定按键当前是否处于按下状态
	 * @param {string} key - 按键名称，如 "ArrowUp", "w", " " 等
	 * @returns {boolean}
	 */
	isPressed(key) {
		return !!this._keyState[key];
	}

	/**
	 * 注册 keydown 事件回调
	 * @param {function(KeyboardEvent): void} callback
	 * @returns {this}
	 */
	onKeyDown(callback) {
		this._keyDownCallbacks.push(callback);
		return this;
	}

	/**
	 * 注册 keyup 事件回调
	 * @param {function(KeyboardEvent): void} callback
	 * @returns {this}
	 */
	onKeyUp(callback) {
		this._keyUpCallbacks.push(callback);
		return this;
	}

	/**
	 * 销毁键盘管理实例，移除所有事件监听
	 * @override
	 */
	destroy() {
		this._target.removeEventListener("keydown", this.processKeyDownEvents);
		this._target.removeEventListener("keyup", this.processKeyUpEvents);
		this._keyState = {};
		this._keyDownCallbacks.length = 0;
		this._keyUpCallbacks.length = 0;
		super.destroy();
	}
}
