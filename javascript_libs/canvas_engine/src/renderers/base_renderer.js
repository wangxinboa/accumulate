import { BaseCleanUp } from "../../../javascript_utils/javascript_utils.js";
import { EventSystem } from "../event/event_system.js";
import { BackgroundSystem } from "./renderer_systems/background/background_system.js";
import { CanvasDomSystem } from "./renderer_systems/canvas_dom/canvas_dom_system.js";

export class BaseRenderer extends BaseCleanUp {
	/** @type {BackgroundSystem} */
	backgroundSystem;
	/** @type {CanvasDomSystem} */
	canvasSystem;
	/** @type {EventSystem} */
	eventSystem;
	/**
	 * @param {CanvasEngineType.RendererOption} rendererOption
	 */
	constructor(rendererOption) {
		super();

		this.backgroundSystem = new BackgroundSystem(rendererOption);
		this.canvasSystem = new CanvasDomSystem(rendererOption);
		this.eventSystem = new EventSystem(this.canvasSystem.canvasDom);
	}
	/**
	 * @param {CanvasEngineType.RenderNode} renderNode
	 * @param {CanvasEngineType.Camera2D} camera
	 * @param {number} timestamp
	 */
	_traverseRender(renderNode, camera, timestamp) {
		let child = null;
		for (let i = 0, len = renderNode.children.length; i < len; i++) {
			child = renderNode.children[i];
			if (child.visible) {
				child.updateTween(timestamp);
				this._renderNode(child, camera, timestamp);
				this._traverseRender(child, camera, timestamp);
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
	/**
	 * @param {number} _width
	 * @param {number} _height
	 */
	resize(_width, _height) {
		throw new Error("Renderer 子类未实现 resize 方法");
	}
	destroy() {
		this.backgroundSystem.destroy();
		this.canvasSystem.destroy();
		this.eventSystem.destroy();

		super.destroy();
	}
}
