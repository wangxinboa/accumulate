import { BaseCleanUp } from "../../../../../javascript_utils/javascript_utils.js";
import { resizeCanvas } from "../../../canvas_engine_utils/scale_canvas.js";

/**
 * 管理画布的 DOM 元素、尺寸和设备像素比。
 *
 * 画布尺寸分为：
 *   - 逻辑尺寸（CSS 像素）：通过 canvas.style.width/height 设置，用于布局。
 *   - 物理像素尺寸：通过 canvas.width/height 设置，用于实际绘图。
 *
 * 设备像素比 (devicePixelRatio) 用于将逻辑尺寸转换为物理像素，保证高 DPI 屏幕清晰。
 *
 * resize() 方法根据父容器的大小更新画布尺寸，并触发所有注册的回调函数。
 */
export class CanvasDomSystem extends BaseCleanUp {
	/** @type {Element | undefined} 父容器元素 */
	containerDom;
	/** @type {HTMLCanvasElement} 画布元素 */
	canvasDom;
	/** @type {number} 设备像素比 */
	devicePixelRatio;
	/** @private @type {CanvasEngineType.CanvasDomResizeCallbacks} 尺寸变化回调列表 */
	_resizeCallback;

	/**
	 * @param {CanvasEngineType.CanvasDomOption} canvasDomOption
	 */
	constructor(canvasDomOption) {
		super();

		this.devicePixelRatio = canvasDomOption.devicePixelRatio ?? window.devicePixelRatio;

		if (canvasDomOption.container) {
			this.canvasDom = document.createElement("canvas");
			this.containerDom = canvasDomOption.container;
			this.containerDom.appendChild(this.canvasDom);
		} else if (canvasDomOption.canvas) {
			this.canvasDom = canvasDomOption.canvas;
		} else {
			throw new Error("CanvasDomSystem 中无法初始化 canvas dom 信息");
		}

		this.resize = this.resize.bind(this);
		window.addEventListener("resize", this.resize);

		this._resizeCallback = [];
	}

	/**
	 * 添加尺寸变化回调，当画布尺寸改变时调用。
	 * @param {CanvasEngineType.CanvasDomResizeCallback} callback
	 */
	addResizeCallback(callback) {
		if (!this._resizeCallback.includes(callback)) {
			this._resizeCallback.push(callback);
		}
	}

	/**
	 * 移除尺寸变化回调。
	 * @param {CanvasEngineType.CanvasDomResizeCallback} callback
	 */
	removeResizeCallback(callback) {
		const index = this._resizeCallback.indexOf(callback);
		if (index > -1) {
			this._resizeCallback.splice(index, 1);
		}
	}

	/**
	 * 重新调整画布尺寸。
	 * 根据父容器的大小和 devicePixelRatio 缩放画布，并触发所有回调。
	 */
	resize() {
		resizeCanvas(this.canvasDom, this.devicePixelRatio);
		this._executeResizeCallback();
	}

	/** @private 执行所有尺寸变化回调 */
	_executeResizeCallback() {
		for (let i = 0, len = this._resizeCallback.length; i < len; i++) {
			this._resizeCallback[i](this.canvasDom.clientWidth, this.canvasDom.clientHeight);
		}
	}

	destroy() {
		window.removeEventListener("resize", this.resize);
		if (this.containerDom) {
			this.canvasDom.remove();
		}
		super.destroy();
	}
}
