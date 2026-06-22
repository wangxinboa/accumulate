import { BaseCleanUp, CustomMap } from "../../../javascript_utils/javascript_utils.js";
import { Vector2 } from "../math/vector2.js";

let _canvasPositionInCamera = new Vector2(0, 0);
let _canvasPositionInScene = new Vector2(0, 0);
let _hitPoint = new Vector2(0, 0);

export class Event2DMode extends BaseCleanUp {
	/** @type {CanvasEngineType.Scene2D | null} */
	scene2D;
	/** @type {CanvasEngineType.Camera2D | null} */
	camera2D;
	/** @type {CustomMap<CanvasEngineType.Render2DNode> | null} */
	tempMoveEnterMap;
	/** @type {CustomMap<CanvasEngineType.Render2DNode>} */
	preMoveEnterMap;
	/** @type {CustomMap<CanvasEngineType.Render2DNode>} */
	nowMoveEnterMap;
	/** @type {Array<CanvasEngineType.Render2DNode>} */
	dragNodes;

	constructor() {
		super();

		this.scene2D = null;
		this.camera2D = null;

		this.tempMoveEnterMap = null;
		this.preMoveEnterMap = new CustomMap();
		this.nowMoveEnterMap = new CustomMap();
		this.dragNodes = [];

		this.hitTestLimit = 1;
	}
	/**
	 * @param {CanvasEngineType.Scene2D} scene2D
	 * @param {CanvasEngineType.Camera2D} camera2D
	 */
	bindScene(scene2D, camera2D) {
		this.scene2D = scene2D;
		this.camera2D = camera2D;
		return this;
	}
	/**
	 * @private
	 * @param {CanvasEngineType.Render2DNode} renderNode
	 */
	_cacheDragPosition(renderNode) {
		renderNode.dragStartNodeX = renderNode.x;
		renderNode.dragStartNodeY = renderNode.y;

		renderNode.dragStartEventSceneX = _canvasPositionInScene.x;
		renderNode.dragStartEventSceneY = _canvasPositionInScene.y;

		renderNode.dragStartEventCameraX = _canvasPositionInCamera.x;
		renderNode.dragStartEventCameraY = _canvasPositionInCamera.y;

		renderNode.isDraging = true;
	}
	/**
	 * @private
	 * @param {CanvasEngineType.Render2DNode} renderNode
	 */
	_updatesDragPosition(renderNode) {
		if (renderNode.applyCameraTransform) {
			renderNode.x = renderNode.dragStartNodeX + _canvasPositionInCamera.x - renderNode.dragStartEventCameraX;
			renderNode.y = renderNode.dragStartNodeY + _canvasPositionInCamera.y - renderNode.dragStartEventCameraY;
		} else {
			renderNode.x = renderNode.dragStartNodeX + _canvasPositionInScene.x - renderNode.dragStartEventSceneX;
			renderNode.y = renderNode.dragStartNodeY + _canvasPositionInScene.y - renderNode.dragStartEventSceneY;
		}
	}
	/**
	 * @private
	 * @param {number} offsetX
	 * @param {number} offsetY
	 */
	_beforeProcess(offsetX, offsetY) {
		_canvasPositionInCamera.set(offsetX, offsetY);
		_canvasPositionInScene.set(offsetX, offsetY);
		if (this.camera2D) {
			this.camera2D.screenToCamera(_canvasPositionInCamera);
		}
	}
	/**
	 * @private
	 * @param {CanvasEngineType.Render2DNode} renderNode
	 */
	_hitTest(renderNode) {
		if (renderNode.applyCameraTransform) {
			_hitPoint.set(_canvasPositionInCamera.x, _canvasPositionInCamera.y);
		} else {
			_hitPoint.set(_canvasPositionInScene.x, _canvasPositionInScene.y);
		}
		_hitPoint.applyMatrix3(renderNode.matrixWorldInvert);
		return renderNode.hitTest(_hitPoint.x, _hitPoint.y);
	}
	/**
	 * @param {number} offsetX
	 * @param {number} offsetY
	 */
	processDownEvents(offsetX, offsetY) {
		this._beforeProcess(offsetX, offsetY);
		if (this.scene2D && this.camera2D) {
			let hitTestCounter = 0;
			for (let i = this.scene2D.allDescendants.length - 1; i >= 0; i--) {
				const descendant = this.scene2D.allDescendants[i];
				if (descendant.hitTestDisabled) {
					continue;
				}
				if (this._hitTest(descendant)) {
					if (descendant.hitTestCountable) {
						hitTestCounter++;
					}
					if (descendant.hasMouseDownEvents) {
						descendant.executeMouseDownEvents(
							_canvasPositionInCamera.x,
							_canvasPositionInCamera.y,
							_canvasPositionInScene.x,
							_canvasPositionInScene.y,
						);
					}
					if (descendant.hasDragStartEvents) {
						descendant.executeDragStartEvents(
							_canvasPositionInCamera.x,
							_canvasPositionInCamera.y,
							_canvasPositionInScene.x,
							_canvasPositionInScene.y,
						);
					}
					if (
						descendant.hasDragStartEvents ||
						descendant.hasDragEvents ||
						descendant.hasDragEndEvents ||
						descendant.dragUpdatesPosition
					) {
						this._cacheDragPosition(descendant);

						this.dragNodes.push(descendant);
					}
				}
				if (this.hitTestLimit <= hitTestCounter) {
					break;
				}
			}
			this.scene2D.executeMouseDownEvents(
				_canvasPositionInCamera.x,
				_canvasPositionInCamera.y,
				_canvasPositionInScene.x,
				_canvasPositionInScene.y,
			);
			if (this.camera2D.dragUpdatesPosition && this.hitTestLimit > hitTestCounter) {
				this._cacheDragPosition(this.camera2D);
			}
		}
	}
	/**
	 * @param {number} offsetX
	 * @param {number} offsetY
	 */
	processMoveEvents(offsetX, offsetY) {
		this._beforeProcess(offsetX, offsetY);
		if (this.scene2D && this.camera2D) {
			if (this.dragNodes.length > 0) {
				for (let i = 0, len = this.dragNodes.length; i < len; i++) {
					const dragNode = this.dragNodes[i];

					if (dragNode.dragUpdatesPosition) {
						this._updatesDragPosition(dragNode);
					}
					if (dragNode.hasDragEvents) {
						dragNode.executeDragEvents(
							_canvasPositionInCamera.x,
							_canvasPositionInCamera.y,
							_canvasPositionInScene.x,
							_canvasPositionInScene.y,
						);
					}
				}
			} else {
				let hitTestCounter = 0;
				for (let i = this.scene2D.allDescendants.length - 1; i >= 0; i--) {
					const descendant = this.scene2D.allDescendants[i];
					if (descendant.hitTestDisabled) {
						continue;
					}
					if (this._hitTest(descendant)) {
						if (descendant.hitTestCountable) {
							hitTestCounter++;
						}
						if (descendant.hasMouseMoveEvents) {
							descendant.executeMouseMoveEvents(
								_canvasPositionInCamera.x,
								_canvasPositionInCamera.y,
								_canvasPositionInScene.x,
								_canvasPositionInScene.y,
							);
						}
						this.nowMoveEnterMap.set(descendant.id, descendant);
						if (descendant.hasMouseEnterEvents && !this.preMoveEnterMap.has(descendant.id)) {
							descendant.executeMouseEnterEvents(
								_canvasPositionInCamera.x,
								_canvasPositionInCamera.y,
								_canvasPositionInScene.x,
								_canvasPositionInScene.y,
							);
						}
					}
					if (this.hitTestLimit <= hitTestCounter) {
						break;
					}
				}
				for (let i = this.preMoveEnterMap.array.length - 1; i >= 0; i--) {
					const preMoveNode = this.preMoveEnterMap.array[i];
					if (preMoveNode.hasMouseLeaveEvents && !this.nowMoveEnterMap.has(preMoveNode.id)) {
						preMoveNode.executeMouseLeaveEvents(
							_canvasPositionInCamera.x,
							_canvasPositionInCamera.y,
							_canvasPositionInScene.x,
							_canvasPositionInScene.y,
						);
					}
				}
				this.tempMoveEnterMap = this.preMoveEnterMap;
				this.preMoveEnterMap = this.nowMoveEnterMap;
				this.nowMoveEnterMap = this.tempMoveEnterMap;
				this.tempMoveEnterMap = null;
				this.nowMoveEnterMap.clear();

				this.scene2D.executeMouseMoveEvents(
					_canvasPositionInCamera.x,
					_canvasPositionInCamera.y,
					_canvasPositionInScene.x,
					_canvasPositionInScene.y,
				);
				if (this.camera2D.isDraging && this.hitTestLimit > hitTestCounter) {
					this._updatesDragPosition(this.camera2D);
				}
			}
		}
	}
	/**
	 * @param {number} offsetX
	 * @param {number} offsetY
	 */
	processUpEvents(offsetX, offsetY) {
		this._beforeProcess(offsetX, offsetY);
		if (this.scene2D && this.camera2D) {
			if (this.dragNodes.length > 0) {
				for (let i = 0, len = this.dragNodes.length; i < len; i++) {
					const dragNode = this.dragNodes[i];
					if (dragNode.hasDragEndEvents) {
						dragNode.executeDragEndEvents(
							_canvasPositionInCamera.x,
							_canvasPositionInCamera.y,
							_canvasPositionInScene.x,
							_canvasPositionInScene.y,
						);
					}
				}
				this.dragNodes.length = 0;
			} else {
				let hitTestCounter = 0;
				for (let i = this.scene2D.allDescendants.length - 1; i >= 0; i--) {
					const descendant = this.scene2D.allDescendants[i];
					if (descendant.hitTestDisabled) {
						continue;
					}
					if (this._hitTest(descendant)) {
						if (descendant.hitTestCountable) {
							hitTestCounter++;
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
					if (this.hitTestLimit <= hitTestCounter) {
						break;
					}
				}
				this.scene2D.executeMouseUpEvents(
					_canvasPositionInCamera.x,
					_canvasPositionInCamera.y,
					_canvasPositionInScene.x,
					_canvasPositionInScene.y,
				);
				if (this.camera2D.isDraging) {
					this.camera2D.isDraging = false;
				}
			}
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
		if (this.scene2D && this.camera2D) {
			this.scene2D.executeWheelEvents(
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
	destroy() {
		this.preMoveEnterMap.destroy();
		this.nowMoveEnterMap.destroy();

		super.destroy();
	}
}
