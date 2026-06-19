import { RenderNode } from "./render_node.js";

export class RenderEventNode extends RenderNode {
	/** @type {boolean} */
	hitTestDisabled;
	/** @type {boolean} */
	hitTestCountable;
	/** @type {Array<Function>} */
	mouseDownEvents;
	/** @type {Array<Function>} */
	mouseMoveEvents;
	/** @type {Array<Function>} */
	mouseUpEvents;
	/** @type {Array<Function>} */
	mouseEnterEvents;
	/** @type {Array<Function>} */
	mouseLeaveEvents;
	/** @type {Array<Function>} */
	dragStartEvents;
	/** @type {Array<Function>} */
	dragEvents;
	/** @type {Array<Function>} */
	dragEndEvents;
	/** @type {Array<Function>} */
	wheelEvents;
	/** @type {number} */
	dragStartNodeX;
	/** @type {number} */
	dragStartNodeY;
	/** @type {number} */
	dragStartEventSceneX;
	/** @type {number} */
	dragStartEventSceneY;
	/** @type {number} */
	dragStartEventCameraX;
	/** @type {number} */
	dragStartEventCameraY;
	/** @type {boolean} */
	dragUpdatesPosition;
	/** @type {boolean} */
	isDraging;
	constructor() {
		super();

		this.hitTestDisabled = false;
		this.hitTestCountable = true;

		this.mouseDownEvents = [];
		this.mouseMoveEvents = [];
		this.mouseUpEvents = [];
		this.mouseEnterEvents = [];
		this.mouseLeaveEvents = [];
		this.dragStartEvents = [];
		this.dragEvents = [];
		this.dragEndEvents = [];

		this.wheelEvents = [];

		this.dragStartNodeX = 0;
		this.dragStartNodeY = 0;
		this.dragStartEventSceneX = 0;
		this.dragStartEventSceneY = 0;
		this.dragStartEventCameraX = 0;
		this.dragStartEventCameraY = 0;
		this.dragUpdatesPosition = false;
		this.isDraging = false;
	}
	get hasMouseDownEvents() {
		return this.mouseDownEvents.length > 0;
	}
	/**
	 * @param {CanvasEngineType.RenderEventNodeCallback<this>} eventCallback
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
			this.mouseDownEvents[i](this, x, y, sx, sy);
		}
		return this;
	}
	get hasMouseMoveEvents() {
		return this.mouseMoveEvents.length > 0;
	}
	/**
	 * @param {CanvasEngineType.RenderEventNodeCallback<this>} eventCallback
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
			this.mouseMoveEvents[i](this, x, y, sx, sy);
		}
		return this;
	}
	get hasMouseUpEvents() {
		return this.mouseUpEvents.length > 0;
	}
	/**
	 * @param {CanvasEngineType.RenderEventNodeCallback<this>} eventCallback
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
			this.mouseUpEvents[i](this, x, y, sx, sy);
		}
		return this;
	}
	get hasMouseEnterEvents() {
		return this.mouseEnterEvents.length > 0;
	}
	/**
	 * @param {CanvasEngineType.RenderEventNodeCallback<this>} eventCallback
	 */
	onMouseEnter(eventCallback) {
		this.mouseEnterEvents.push(eventCallback);
		return this;
	}
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} sx
	 * @param {number} sy
	 */
	executeMouseEnterEvents(x, y, sx, sy) {
		for (let i = 0, len = this.mouseEnterEvents.length; i < len; i++) {
			this.mouseEnterEvents[i](this, x, y, sx, sy);
		}
		return this;
	}
	get hasMouseLeaveEvents() {
		return this.mouseLeaveEvents.length > 0;
	}
	/**
	 * @param {CanvasEngineType.RenderEventNodeCallback<this>} eventCallback
	 */
	onMouseLeave(eventCallback) {
		this.mouseLeaveEvents.push(eventCallback);
		return this;
	}
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} sx
	 * @param {number} sy
	 */
	executeMouseLeaveEvents(x, y, sx, sy) {
		for (let i = 0, len = this.mouseLeaveEvents.length; i < len; i++) {
			this.mouseLeaveEvents[i](this, x, y, sx, sy);
		}
		return this;
	}
	get hasDragStartEvents() {
		return this.dragStartEvents.length > 0;
	}
	/**
	 * @param {CanvasEngineType.RenderEventNodeCallback<this>} eventCallback
	 */
	onDragStart(eventCallback) {
		this.dragStartEvents.push(eventCallback);
		return this;
	}
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} sx
	 * @param {number} sy
	 */
	executeDragStartEvents(x, y, sx, sy) {
		for (let i = 0, len = this.dragStartEvents.length; i < len; i++) {
			this.dragStartEvents[i](this, x, y, sx, sy);
		}
		return this;
	}
	get hasDragEvents() {
		return this.dragEvents.length > 0;
	}
	/**
	 * @param {CanvasEngineType.RenderEventNodeCallback<this>} eventCallback
	 */
	onDrag(eventCallback) {
		this.dragEvents.push(eventCallback);
		return this;
	}
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} sx
	 * @param {number} sy
	 */
	executeDragEvents(x, y, sx, sy) {
		for (let i = 0, len = this.dragEvents.length; i < len; i++) {
			this.dragEvents[i](this, x, y, sx, sy);
		}
		return this;
	}
	get hasDragEndEvents() {
		return this.dragEndEvents.length > 0;
	}
	/**
	 * @param {CanvasEngineType.RenderEventNodeCallback<this>} eventCallback
	 */
	onDragEnd(eventCallback) {
		this.dragEndEvents.push(eventCallback);
		return this;
	}
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} sx
	 * @param {number} sy
	 */
	executeDragEndEvents(x, y, sx, sy) {
		for (let i = 0, len = this.dragEndEvents.length; i < len; i++) {
			this.dragEndEvents[i](this, x, y, sx, sy);
		}
		return this;
	}
	/**
	 * @param {CanvasEngineType.RenderNodeWheelEventCallback<this>} eventCallback
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
		for (let i = 0, len = this.wheelEvents.length; i < len; i++) {
			this.wheelEvents[i](this, dx, dy, dz, x, y, sx, sy);
		}
		return this;
	}
}
