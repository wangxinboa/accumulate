import { BaseCleanUp } from "../../../javascript_utils/javascript_utils.js";
import { Event2DMode } from "./event_2d_mode.js";

export class EventSystem extends BaseCleanUp {
	/** @private @type {HTMLElement} */
	_domElement;
	/** @type {Event2DMode} */
	event2DMode;
	/** @type {Event2DMode | null} */
	activeEvent;
	/**
	 * @param {HTMLElement} domElement
	 */
	constructor(domElement) {
		super();
		this._domElement = domElement;
		this.event2DMode = new Event2DMode();

		this.activeEvent = null;

		// 绑定事件处理函数上下文
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.onWheel = this.onWheel.bind(this);
		this.onContextMenu = this.onContextMenu.bind(this);

		// 注册事件监听器
		this._domElement.addEventListener("mousedown", this.onMouseDown);
		window.addEventListener("mousemove", this.onMouseMove);
		window.addEventListener("mouseup", this.onMouseUp);
		this._domElement.addEventListener("wheel", this.onWheel, { passive: true });
		this._domElement.addEventListener("contextmenu", this.onContextMenu);
	}
	/**
	 * 激活2D事件模式
	 * @param {CanvasEngineType.Scene2D} scene
	 * @param {CanvasEngineType.Camera2D} camera
	 */
	activate2D(scene, camera) {
		this.activeEvent = this.event2DMode.bindScene(scene, camera);
	}
	/**
	 * 处理鼠标按下事件
	 * @param {MouseEvent} event
	 */
	onMouseDown(event) {
		event.preventDefault();
		if (this.activeEvent) {
			this.activeEvent.processDownEvents(event.offsetX, event.offsetY);
		}
	}
	/**
	 * 处理鼠标移动事件
	 * @param {MouseEvent} event
	 */
	onMouseMove(event) {
		if (this.activeEvent) {
			this.activeEvent.processMoveEvents(event.offsetX, event.offsetY);
		}
	}
	/**
	 * 处理鼠标抬起事件
	 * @param {MouseEvent} event
	 */
	onMouseUp(event) {
		if (this.activeEvent) {
			this.activeEvent.processUpEvents(event.offsetX, event.offsetY);
		}
	}
	/**
	 * 处理鼠标滚轮事件
	 * @param {WheelEvent} event
	 */
	onWheel(event) {
		if (this.activeEvent) {
			this.activeEvent.processWheelEvents(event.deltaX, event.deltaY, event.deltaZ, event.offsetX, event.offsetY);
		}
	}
	/**
	 * 禁止右键菜单弹出
	 * @param {MouseEvent} event
	 */
	onContextMenu(event) {
		event.preventDefault();
	}
	/**
	 * 销毁事件系统，移除所有事件监听器
	 */
	destroy() {
		this.event2DMode.destroy();

		this._domElement.removeEventListener("mousedown", this.onMouseDown);
		window.removeEventListener("mousemove", this.onMouseMove);
		window.removeEventListener("mouseup", this.onMouseUp);
		this._domElement.removeEventListener("wheel", this.onWheel);
		this._domElement.removeEventListener("contextmenu", this.onContextMenu);

		super.destroy();
	}
}
