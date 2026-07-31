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
	/** @type {Array<Function>} */
	clickEvents;
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
	dragUpdatePosition;
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
		this.clickEvents = [];

		this.dragStartNodeX = 0;
		this.dragStartNodeY = 0;
		this.dragStartEventSceneX = 0;
		this.dragStartEventSceneY = 0;
		this.dragStartEventCameraX = 0;
		this.dragStartEventCameraY = 0;
		this.dragUpdatePosition = false;
		this.isDraging = false;
	}
	get hasMouseDownEvents() {
		return this.mouseDownEvents.length > 0;
	}
	/**
	 * @param {CanvasEngineType.RenderEventNodeCallback<this>} eventCallback
	 */
	addMouseDownEvent(eventCallback) {
		if (!this.mouseDownEvents.includes(eventCallback)) {
			this.mouseDownEvents.push(eventCallback);
		}
		return this;
	}
	/**
	 * @param {CanvasEngineType.RenderEventNodeCallback<this>} eventCallback
	 */
	removeMouseDownEvent(eventCallback) {
		const index = this.mouseDownEvents.indexOf(eventCallback);
		if (index !== -1) {
			this.mouseDownEvents.splice(index, 1);
		}
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
	addMouseMoveEvent(eventCallback) {
		if (!this.mouseMoveEvents.includes(eventCallback)) {
			this.mouseMoveEvents.push(eventCallback);
		}
		return this;
	}
	/**
	 * @param {CanvasEngineType.RenderEventNodeCallback<this>} eventCallback
	 */
	removeMouseMoveEvent(eventCallback) {
		const index = this.mouseMoveEvents.indexOf(eventCallback);
		if (index !== -1) {
			this.mouseMoveEvents.splice(index, 1);
		}
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
	addMouseUpEvent(eventCallback) {
		if (!this.mouseUpEvents.includes(eventCallback)) {
			this.mouseUpEvents.push(eventCallback);
		}
		return this;
	}
	/**
	 * @param {CanvasEngineType.RenderEventNodeCallback<this>} eventCallback
	 */
	removeMouseUpEvent(eventCallback) {
		const index = this.mouseUpEvents.indexOf(eventCallback);
		if (index !== -1) {
			this.mouseUpEvents.splice(index, 1);
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
	executeMouseUpEvents(x, y, sx, sy, hasMovedAfterDown) {
		for (let i = 0, len = this.mouseUpEvents.length; i < len; i++) {
			this.mouseUpEvents[i](this, x, y, sx, sy, hasMovedAfterDown);
		}
		return this;
	}
	get hasMouseEnterEvents() {
		return this.mouseEnterEvents.length > 0;
	}
	/**
	 * @param {CanvasEngineType.RenderEventNodeCallback<this>} eventCallback
	 */
	addMouseEnterEvent(eventCallback) {
		if (!this.mouseEnterEvents.includes(eventCallback)) {
			this.mouseEnterEvents.push(eventCallback);
		}
		return this;
	}
	/**
	 * @param {CanvasEngineType.RenderEventNodeCallback<this>} eventCallback
	 */
	removeMouseEnterEvent(eventCallback) {
		const index = this.mouseEnterEvents.indexOf(eventCallback);
		if (index !== -1) {
			this.mouseEnterEvents.splice(index, 1);
		}
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
	addMouseLeaveEvent(eventCallback) {
		if (!this.mouseLeaveEvents.includes(eventCallback)) {
			this.mouseLeaveEvents.push(eventCallback);
		}
		return this;
	}
	/**
	 * @param {CanvasEngineType.RenderEventNodeCallback<this>} eventCallback
	 */
	removeMouseLeaveEvent(eventCallback) {
		const index = this.mouseLeaveEvents.indexOf(eventCallback);
		if (index !== -1) {
			this.mouseLeaveEvents.splice(index, 1);
		}
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
	addDragStartEvent(eventCallback) {
		if (!this.dragStartEvents.includes(eventCallback)) {
			this.dragStartEvents.push(eventCallback);
		}
		return this;
	}
	/**
	 * @param {CanvasEngineType.RenderEventNodeCallback<this>} eventCallback
	 */
	removeDragStartEvent(eventCallback) {
		const index = this.dragStartEvents.indexOf(eventCallback);
		if (index !== -1) {
			this.dragStartEvents.splice(index, 1);
		}
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
	addDragEvent(eventCallback) {
		if (!this.dragEvents.includes(eventCallback)) {
			this.dragEvents.push(eventCallback);
		}
		return this;
	}
	/**
	 * @param {CanvasEngineType.RenderEventNodeCallback<this>} eventCallback
	 */
	removeDragEvent(eventCallback) {
		const index = this.dragEvents.indexOf(eventCallback);
		if (index !== -1) {
			this.dragEvents.splice(index, 1);
		}
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
	addDragEndEvent(eventCallback) {
		if (!this.dragEndEvents.includes(eventCallback)) {
			this.dragEndEvents.push(eventCallback);
		}
		return this;
	}
	/**
	 * @param {CanvasEngineType.RenderEventNodeCallback<this>} eventCallback
	 */
	removeDragEndEvent(eventCallback) {
		const index = this.dragEndEvents.indexOf(eventCallback);
		if (index !== -1) {
			this.dragEndEvents.splice(index, 1);
		}
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
	addWheelEvent(eventCallback) {
		if (!this.wheelEvents.includes(eventCallback)) {
			this.wheelEvents.push(eventCallback);
		}
		return this;
	}
	/**
	 * @param {CanvasEngineType.RenderNodeWheelEventCallback<this>} eventCallback
	 */
	removeWheelEvent(eventCallback) {
		const index = this.wheelEvents.indexOf(eventCallback);
		if (index !== -1) {
			this.wheelEvents.splice(index, 1);
		}
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

	// ===== Click 事件 =====
	get hasClickEvents() {
		return this.clickEvents.length > 0;
	}
	/**
	 * @param {CanvasEngineType.RenderEventNodeCallback<this>} eventCallback
	 */
	addClickEvent(eventCallback) {
		if (!this.clickEvents.includes(eventCallback)) {
			this.clickEvents.push(eventCallback);
		}
		return this;
	}
	/**
	 * @param {CanvasEngineType.RenderEventNodeCallback<this>} eventCallback
	 */
	removeClickEvent(eventCallback) {
		const index = this.clickEvents.indexOf(eventCallback);
		if (index !== -1) {
			this.clickEvents.splice(index, 1);
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
	executeClickEvents(x, y, sx, sy, hasMovedAfterDown) {
		for (let i = 0, len = this.clickEvents.length; i < len; i++) {
			this.clickEvents[i](this, x, y, sx, sy, hasMovedAfterDown);
		}
		return this;
	}

	destroy() {
		this.mouseDownEvents.length = 0;
		this.mouseMoveEvents.length = 0;
		this.mouseUpEvents.length = 0;
		this.mouseEnterEvents.length = 0;
		this.mouseLeaveEvents.length = 0;
		this.dragStartEvents.length = 0;
		this.dragEvents.length = 0;
		this.dragEndEvents.length = 0;
		this.wheelEvents.length = 0;
		this.clickEvents.length = 0;

		super.destroy();
	}
}
