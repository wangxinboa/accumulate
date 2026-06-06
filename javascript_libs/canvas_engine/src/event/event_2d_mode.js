import { BaseCleanUp } from "../../../javascript_utils/javascript_utils.js";
import { Vector2 } from "../math/vector2.js";

let _hitTestCounter = 0;
let _canvasPositionInCamera = new Vector2(0, 0);
let _canvasPositionInScene = new Vector2(0, 0);
let _hitPoint = new Vector2();

export class Event2DMode extends BaseCleanUp {
	/** @type {CanvasEngineType.Scene2D | null} */
	scene2d;
	/** @type {CanvasEngineType.Camera2D | null} */
	camera2d;
	constructor() {
		super();

		this.scene2d = null;
		this.camera2d = null;

		this.hitTestLimit = 1;
	}
	/**
	 * @param {CanvasEngineType.Scene2D} scene2d
	 * @param {CanvasEngineType.Camera2D} camera2d
	 */
	bindScene(scene2d, camera2d) {
		this.scene2d = scene2d;
		this.camera2d = camera2d;
		return this;
	}
	/**
	 * @private
	 * @param {number} offsetX
	 * @param {number} offsetY
	 */
	_beforeProcess(offsetX, offsetY) {
		_hitTestCounter = 0;

		_canvasPositionInCamera.set(offsetX, offsetY);
		_canvasPositionInScene.set(offsetX, offsetY);
		if (this.camera2d) {
			_canvasPositionInCamera.applyMatrix3(this.camera2d.matrix3WorldInvert);
		}
	}
	/**
	 * @private
	 * @param {CanvasEngineType.AllRenderNode} renderNode
	 */
	_hitTest(renderNode) {
		if (renderNode.applyCameraTransform) {
			_hitPoint.set(_canvasPositionInCamera.x, _canvasPositionInCamera.y);
		} else {
			_hitPoint.set(_canvasPositionInScene.x, _canvasPositionInScene.y);
		}
		_hitPoint.applyMatrix3(renderNode.matrix3WorldInvert);

		return renderNode.hitTest(_hitPoint.x, _hitPoint.y);
	}
	/**
	 * @param {number} offsetX
	 * @param {number} offsetY
	 */
	processDownEvents(offsetX, offsetY) {
		this._beforeProcess(offsetX, offsetY);
		if (this.scene2d) {
			for (let i = 0, len = this.scene2d.allDescendants.length; i < len; i++) {
				const descendant = this.scene2d.allDescendants[i];

				if (descendant.hitTestDisabled) {
					continue;
				}
				if (this._hitTest(descendant)) {
					if (descendant.hitTestCountable) {
						_hitTestCounter++;
					}
					if (descendant.hasMouseDownEvents) {
						descendant.executeMouseDownEvents(
							_canvasPositionInCamera.x,
							_canvasPositionInCamera.y,
							_canvasPositionInScene.x,
							_canvasPositionInScene.y,
						);
					}
				}

				if (this.hitTestLimit <= _hitTestCounter) {
					break;
				}
			}

			this.scene2d.executeMouseDownEvents(
				_canvasPositionInCamera.x,
				_canvasPositionInCamera.y,
				_canvasPositionInScene.x,
				_canvasPositionInScene.y,
			);
		}
	}
	/**
	 * @param {number} offsetX
	 * @param {number} offsetY
	 */
	processMoveEvents(offsetX, offsetY) {
		this._beforeProcess(offsetX, offsetY);
		if (this.scene2d) {
			for (let i = 0, len = this.scene2d.allDescendants.length; i < len; i++) {
				const descendant = this.scene2d.allDescendants[i];
				if (descendant.hitTestDisabled) {
					continue;
				}
				if (this._hitTest(descendant)) {
					if (descendant.hitTestCountable) {
						_hitTestCounter++;
					}
					if (descendant.hasMouseMoveEvents) {
						descendant.executeMouseMoveEvents(
							_canvasPositionInCamera.x,
							_canvasPositionInCamera.y,
							_canvasPositionInScene.x,
							_canvasPositionInScene.y,
						);
					}
				}
				if (this.hitTestLimit <= _hitTestCounter) {
					break;
				}
			}
			this.scene2d.executeMouseMoveEvents(
				_canvasPositionInCamera.x,
				_canvasPositionInCamera.y,
				_canvasPositionInScene.x,
				_canvasPositionInScene.y,
			);
		}
	}
	/**
	 * @param {number} offsetX
	 * @param {number} offsetY
	 */
	processUpEvents(offsetX, offsetY) {
		this._beforeProcess(offsetX, offsetY);
		if (this.scene2d) {
			for (let i = 0, len = this.scene2d.allDescendants.length; i < len; i++) {
				const descendant = this.scene2d.allDescendants[i];
				if (descendant.hitTestDisabled) {
					continue;
				}
				if (this._hitTest(descendant)) {
					if (descendant.hitTestCountable) {
						_hitTestCounter++;
					}
					if (descendant.hasMouseUpEvents) {
						descendant.executeMouseUpEvents(
							_canvasPositionInCamera.x,
							_canvasPositionInCamera.y,
							_canvasPositionInScene.x,
							_canvasPositionInScene.y,
						);
					}
				}
			}
			this.scene2d.executeMouseUpEvents(
				_canvasPositionInCamera.x,
				_canvasPositionInCamera.y,
				_canvasPositionInScene.x,
				_canvasPositionInScene.y,
			);
		}
	}
	/**
	 * @param {number} deltaX
	 * @param {number} deltaY
	 * @param {number} deltaZ
	 * @param {number} offsetX
	 * @param {number} offsetY
	 */
	processWheelEvents(deltaX, deltaY, deltaZ, offsetX, offsetY) {
		this._beforeProcess(offsetX, offsetY);
		if (this.scene2d) {
			this.scene2d.executeWheelEvents(
				deltaX,
				deltaY,
				deltaZ,
				_canvasPositionInCamera.x,
				_canvasPositionInCamera.y,
				_canvasPositionInScene.x,
				_canvasPositionInScene.y,
			);
		}
	}
}
