import { Render2DNode } from "./render_2d_node.js";

export class Scene2D extends Render2DNode {
	/** @type {Array<CanvasEngineType.Render2DNode>} */
	allEventDescendants;
	/** @type {Array<Function>} 无节点被命中时的鼠标按下事件 */
	mouseDownWhenNoNodeHitEvents;
	/** @type {Array<Function>} 无节点被命中时的鼠标移动事件 */
	mouseMoveWhenNoNodeHitEvents;
	/** @type {Array<Function>} 无节点被命中时的鼠标抬起事件 */
	mouseUpWhenNoNodeHitEvents;
	constructor() {
		super();

		this.isScene2D = true;

		this.allEventDescendants = [];
		this.mouseDownWhenNoNodeHitEvents = [];
		this.mouseMoveWhenNoNodeHitEvents = [];
		this.mouseUpWhenNoNodeHitEvents = [];
	}
	/**
	 * @param {CanvasEngineType.Render2DNode} node
	 */
	registerEventDescendant(node) {
		this.allEventDescendants.push(node);
	}
	clearEventDescendants() {
		this.allEventDescendants.length = 0;
	}

	// ===== 无节点命中时的场景事件 =====
	/**
	 * 注册鼠标按下事件（仅在没有任何可计数节点被命中时触发）
	 * @param {CanvasEngineType.RenderEventNodeCallback<this>} eventCallback
	 * @returns {this}
	 */
	addMouseDownEventWhenNoNodeHit(eventCallback) {
		if (!this.mouseDownWhenNoNodeHitEvents.includes(eventCallback)) {
			this.mouseDownWhenNoNodeHitEvents.push(eventCallback);
		}
		return this;
	}
	/**
	 * @param {CanvasEngineType.RenderEventNodeCallback<this>} eventCallback
	 * @returns {this}
	 */
	removeMouseDownEventWhenNoNodeHit(eventCallback) {
		const index = this.mouseDownWhenNoNodeHitEvents.indexOf(eventCallback);
		if (index !== -1) {
			this.mouseDownWhenNoNodeHitEvents.splice(index, 1);
		}
		return this;
	}
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} sx
	 * @param {number} sy
	 */
	executeMouseDownWhenNoNodeHitEvents(x, y, sx, sy) {
		for (let i = 0, len = this.mouseDownWhenNoNodeHitEvents.length; i < len; i++) {
			this.mouseDownWhenNoNodeHitEvents[i](this, x, y, sx, sy);
		}
		return this;
	}

	/**
	 * 注册鼠标移动事件（仅在没有任何可计数节点被命中时触发）
	 * @param {CanvasEngineType.RenderEventNodeCallback<this>} eventCallback
	 * @returns {this}
	 */
	addMouseMoveEventWhenNoNodeHit(eventCallback) {
		if (!this.mouseMoveWhenNoNodeHitEvents.includes(eventCallback)) {
			this.mouseMoveWhenNoNodeHitEvents.push(eventCallback);
		}
		return this;
	}
	/**
	 * @param {CanvasEngineType.RenderEventNodeCallback<this>} eventCallback
	 * @returns {this}
	 */
	removeMouseMoveEventWhenNoNodeHit(eventCallback) {
		const index = this.mouseMoveWhenNoNodeHitEvents.indexOf(eventCallback);
		if (index !== -1) {
			this.mouseMoveWhenNoNodeHitEvents.splice(index, 1);
		}
		return this;
	}
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} sx
	 * @param {number} sy
	 */
	executeMouseMoveWhenNoNodeHitEvents(x, y, sx, sy) {
		for (let i = 0, len = this.mouseMoveWhenNoNodeHitEvents.length; i < len; i++) {
			this.mouseMoveWhenNoNodeHitEvents[i](this, x, y, sx, sy);
		}
		return this;
	}

	/**
	 * 注册鼠标抬起事件（仅在没有任何可计数节点被命中时触发）
	 * @param {CanvasEngineType.RenderEventNodeCallback<this>} eventCallback
	 * @returns {this}
	 */
	addMouseUpEventWhenNoNodeHit(eventCallback) {
		if (!this.mouseUpWhenNoNodeHitEvents.includes(eventCallback)) {
			this.mouseUpWhenNoNodeHitEvents.push(eventCallback);
		}
		return this;
	}
	/**
	 * @param {CanvasEngineType.RenderEventNodeCallback<this>} eventCallback
	 * @returns {this}
	 */
	removeMouseUpEventWhenNoNodeHit(eventCallback) {
		const index = this.mouseUpWhenNoNodeHitEvents.indexOf(eventCallback);
		if (index !== -1) {
			this.mouseUpWhenNoNodeHitEvents.splice(index, 1);
		}
		return this;
	}
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} sx
	 * @param {number} sy
	 * @param {boolean} hasMovedAfterDown
	 */
	executeMouseUpWhenNoNodeHitEvents(x, y, sx, sy, hasMovedAfterDown) {
		for (let i = 0, len = this.mouseUpWhenNoNodeHitEvents.length; i < len; i++) {
			this.mouseUpWhenNoNodeHitEvents[i](this, x, y, sx, sy, hasMovedAfterDown);
		}
		return this;
	}
}
