import { RenderNode } from "./render_node.js";

export class RenderNodeEvent extends RenderNode {
	/** @type {boolean} */
	hitTestDisabled;
	/** @type {boolean} */
	hitTestCountable;
	/** @type {CanvasEngineType.RenderNodeEventCallbacks} */
	mouseDownEvents;
	/** @type {CanvasEngineType.RenderNodeEventCallbacks} */
	mouseMoveEvents;
	/** @type {CanvasEngineType.RenderNodeEventCallbacks} */
	mouseUpEvents;
	/** @type {CanvasEngineType.RenderNodeEventCallbacks} */
	mouseEnterEvents;
	/** @type {CanvasEngineType.RenderNodeEventCallbacks} */
	mouseLeaveEvents;
	/** @type {CanvasEngineType.RenderNodeWheelEventCallbacks} */
	wheelEvents;
	constructor() {
		super();

		this.hitTestDisabled = false;
		this.hitTestCountable = true;

		this.mouseDownEvents = [];
		this.mouseMoveEvents = [];
		this.mouseUpEvents = [];
		this.mouseEnterEvents = [];
		this.mouseLeaveEvents = [];
		this.wheelEvents = [];
	}
	/**
	 * @param {CanvasEngineType.RenderNodeEventCallback} eventCallback
	 */
	onMouseDown(eventCallback) {
		this.mouseDownEvents.push(eventCallback);
		return this;
	}
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} sx
	 * @param {number} sy
	 */
	executeMouseDownEvents(x, y, sx, sy) {
		for (let i = 0, len = this.mouseDownEvents.length; i < len; i++) {
			this.mouseDownEvents[i](x, y, sx, sy);
		}
		return this;
	}
	get hasMouseMoveEvents() {
		return this.mouseMoveEvents.length > 0;
	}
	/**
	 * @param {CanvasEngineType.RenderNodeEventCallback} eventCallback
	 */
	onMouseMove(eventCallback) {
		this.mouseMoveEvents.push(eventCallback);
		return this;
	}
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} sx
	 * @param {number} sy
	 */
	executeMouseMoveEvents(x, y, sx, sy) {
		for (let i = 0, len = this.mouseMoveEvents.length; i < len; i++) {
			this.mouseMoveEvents[i](x, y, sx, sy);
		}
		return this;
	}
	get hasMouseUpEvents() {
		return this.mouseUpEvents.length > 0;
	}
	/**
	 * @param {CanvasEngineType.RenderNodeEventCallback} eventCallback
	 */
	onMouseUp(eventCallback) {
		this.mouseUpEvents.push(eventCallback);
		return this;
	}
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} sx
	 * @param {number} sy
	 */
	executeMouseUpEvents(x, y, sx, sy) {
		for (let i = 0, len = this.mouseUpEvents.length; i < len; i++) {
			this.mouseUpEvents[i](x, y, sx, sy);
		}
		return this;
	}
	get hasMouseDownEvents() {
		return this.mouseDownEvents.length > 0;
	}
	/**
	 * @param {CanvasEngineType.RenderNodeWheelEventCallback} eventCallback
	 */
	onWheel(eventCallback) {
		this.wheelEvents.push(eventCallback);
		return this;
	}
	/**
	 * @param {number} dx
	 * @param {number} dy
	 * @param {number} dz
	 * @param {number} x
	 * @param {number} y
	 * @param {number} sx
	 * @param {number} sy
	 */
	executeWheelEvents(dx, dy, dz, x, y, sx, sy) {
		for (let i = 0, len = this.mouseUpEvents.length; i < len; i++) {
			this.wheelEvents[i](dx, dy, dz, x, y, sx, sy);
		}
		return this;
	}
}
