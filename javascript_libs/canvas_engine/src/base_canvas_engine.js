import { BaseCleanUp } from "../../javascript_utils/javascript_utils.js";
import { TimeTicker } from "./time_ticker/time_ticker.js";

export class BaseCanvasEngine extends BaseCleanUp {
	/** @type {TimeTicker} */
	timeTicker;
	/** @type {CanvasEngineType.BaseCanvasEngineResizeCallbacks} */
	_resizeCallbacks;

	/**
	 * @param {CanvasEngineType.CanvasEngineOption} canvasEngineOption
	 */
	constructor(canvasEngineOption) {
		super();

		this.render = this.render.bind(this);
		this._resizeCallbacks = [];

		this.timeTicker = new TimeTicker(canvasEngineOption);
		this.timeTicker.registerRunCallback(this.render);
	}

	/**
	 * 注册 resize 回调，会在画布尺寸变化时被调用
	 * @param {CanvasEngineType.BaseCanvasEngineResizeCallback} callback
	 */
	registerResizeCallback(callback) {
		if (!this._resizeCallbacks.includes(callback)) {
			this._resizeCallbacks.push(callback);
		}
	}

	/**
	 * 取消已注册的 resize 回调
	 * @param {CanvasEngineType.BaseCanvasEngineResizeCallback} callback - 需要移除的回调函数
	 */
	unregisterResizeCallback(callback) {
		const index = this._resizeCallbacks.indexOf(callback);
		if (index > -1) {
			this._resizeCallbacks.splice(index, 1);
		}
	}

	/**
	 * 触发 resize 事件，执行所有注册的回调
	 * 子类可以重写此方法，但建议先调用 super.resize(width, height)
	 * @param {number} width - 新的宽度
	 * @param {number} height - 新的高度
	 */
	executeResizeCallbacks(width, height) {
		for (let i = 0, len = this._resizeCallbacks.length; i < len; i++) {
			this._resizeCallbacks[i](width, height);
		}
	}

	/**
	 * @param {number} _timestamp
	 */
	render(_timestamp) {
		throw new Error("CanvasEngine 子类未实现 render 方法");
	}

	destroy() {
		// 清空回调，避免内存泄漏
		this._resizeCallbacks = [];
		this.timeTicker.destroy();
		super.destroy();
	}
}
