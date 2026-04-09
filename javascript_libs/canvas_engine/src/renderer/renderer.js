import { BaseCleanUp } from "../../../javascript_utils/javascript_utils.js";
import { BackgroundSystem } from "./renderer_system/background/background_system.js";
import { CanvasDomSystem } from "./renderer_system/canvas_dom/canvas_dom_system.js";

export class Renderer extends BaseCleanUp {
	/** @type {BackgroundSystem} */
	backgroundSystem;
	/** @type {CanvasDomSystem} */
	canvasSystem;
	/**
	 * @param {CanvasEngineType.RendererOption} rendererOption
	 */
	constructor(rendererOption) {
		super();

		this.backgroundSystem = new BackgroundSystem(rendererOption);
		this.canvasSystem = new CanvasDomSystem(rendererOption);
	}
	/**
	 * @abstract @param {CanvasEngineType.RenderNode} renderNode
	 * @param {CanvasEngineType.Camera2D} camera
	 * @param {number} timestamp
	 */
	_traverseRender(renderNode, camera, timestamp) {
		let child = null;
		for (let i = 0, len = renderNode.children.length; i < len; i++) {
			child = renderNode.children[i];
			if (child.visible) {
				this._renderNode(child, camera, timestamp);
			}
		}
		child = null;
	}
	/**
	 * @abstract @param {CanvasEngineType.RenderNode} _renderNode
	 * @param {CanvasEngineType.Camera2D} _camera
	 * @param {number} _timestamp
	 */
	_renderNode(_renderNode, _camera, _timestamp) {
		throw new Error("Renderer 子类未实现 _renderNode 方法");
	}

	get canvas() {
		return this.canvasSystem.canvasDom;
	}

	destroy() {
		this.backgroundSystem.destroy();
		this.canvasSystem.destroy();

		super.destroy();
	}
}
