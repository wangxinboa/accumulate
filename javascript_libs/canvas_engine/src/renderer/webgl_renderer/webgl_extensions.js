import { BaseCleanUp } from "../../../../javascript_utils/javascript_utils.js";

export class WebGLExtensions extends BaseCleanUp {
	/** @type {CanvasEngineType.WebGLRenderer} */
	renderer;
	/** @type {WEBGL_lose_context | null} */
	WEBGL_lose_context;
	/** @type {boolean} 是否是拓展执行 .loseContext() 触发的 webglcontextlost 事件 */
	isExtensionLossTriggered;
	/**
	 * @param {CanvasEngineType.WebGLRenderer} renderer
	 */
	constructor(renderer) {
		super();

		this.renderer = renderer;

		this.WEBGL_lose_context = null;

		this.isExtensionLossTriggered = false;

		this._extensionRestoreContext = this._extensionRestoreContext.bind(this);
		this._handleContextLost = this._handleContextLost.bind(this);
		this._handleContextRestored = this._handleContextRestored.bind(this);
	}
	initCanvas() {
		this.renderer.canvasSystem.canvasDom.addEventListener("webglcontextlost", this._handleContextLost);
		this.renderer.canvasSystem.canvasDom.addEventListener("webglcontextrestored", this._handleContextRestored);
	}

	initExtensions() {
		this.WEBGL_lose_context = this.renderer.gl.getExtension("WEBGL_lose_context");
	}
	/** 执行 gl context 上下文丢失 */
	extensionContextLost() {
		this.isExtensionLossTriggered = true;
		this.WEBGL_lose_context?.loseContext();
	}
	/** @private */
	_extensionRestoreContext() {
		if (this.isExtensionLossTriggered) {
			this.isExtensionLossTriggered = false;
			this.WEBGL_lose_context?.restoreContext();
		}
	}
	/**
	 * @private @param {Event} webglContextEvent
	 */
	_handleContextLost(webglContextEvent) {
		webglContextEvent.preventDefault();
		// 如果需要 WebGLContextEvent 特有属性，可在此处断言：(event as WebGLContextEvent)
		if (this.renderer.gl.isContextLost()) {
			this.renderer.deleteGlCache();

			setTimeout(this._extensionRestoreContext, 0);
		}
	}
	/** @private */
	_handleContextRestored() {
		this.renderer.resetGl();
	}
	destroy() {
		this.renderer.canvasSystem.canvasDom.removeEventListener("webglcontextlost", this._handleContextLost);
		this.renderer.canvasSystem.canvasDom.removeEventListener("webglcontextrestored", this._handleContextRestored);

		super.destroy();
	}
}
