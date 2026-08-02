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

	/** @private @type {CanvasEngineType.Render2DNode | null} */
	_mouseDownHitNode;
	/** @private @type {number | null} */
	_mouseDownScreenX;
	/** @private @type {number | null} */
	_mouseDownScreenY;
	/** @private @type {boolean} 是否已发生有效拖拽（移动超过阈值） */
	_hasMovedAfterDown;

	constructor() {
		super();

		this.scene2D = null;
		this.camera2D = null;

		this.tempMoveEnterMap = null;
		this.preMoveEnterMap = new CustomMap();
		this.nowMoveEnterMap = new CustomMap();
		this.dragNodes = [];

		this._mouseDownHitNode = null;
		this._mouseDownScreenX = null;
		this._mouseDownScreenY = null;
		this._hasMovedAfterDown = false;

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
	_updateDragPosition(renderNode) {
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
	 * @param {CanvasEngineType.Camera2D} camera2D
	 * @param {number} offsetX
	 * @param {number} offsetY
	 */
	_beforeProcess(camera2D, offsetX, offsetY) {
		_canvasPositionInCamera.set(offsetX - camera2D.width / 2, -(offsetY - camera2D.height / 2));
		_canvasPositionInScene.copy(_canvasPositionInCamera);
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
	 * 公开的命中测试方法，不触发任何事件
	 * @param {number} cameraX - 相机坐标 x
	 * @param {number} cameraY - 相机坐标 y
	 * @returns {boolean} 是否命中任何可计数的节点
	 */
	hitTestPointInCamera(cameraX, cameraY) {
		if (!this.scene2D) {
			return false;
		}

		for (let i = this.scene2D.allEventDescendants.length - 1; i >= 0; i--) {
			const descendant = this.scene2D.allEventDescendants[i];
			if (descendant.hitTestDisabled) {
				continue;
			}
			_hitPoint.set(cameraX, cameraY);
			_hitPoint.applyMatrix3(descendant.matrixWorldInvert);

			if (descendant.hitTest(_hitPoint.x, _hitPoint.y)) {
				return true;
			}
		}
		return false;
	}
	/**
	 * @param {number} offsetX
	 * @param {number} offsetY
	 */
	processDownEvents(offsetX, offsetY) {
		if (this.scene2D && this.camera2D) {
			this._beforeProcess(this.camera2D, offsetX, offsetY);

			this._mouseDownScreenX = offsetX;
			this._mouseDownScreenY = offsetY;

			let hitTestCounter = 0;
			for (let i = this.scene2D.allEventDescendants.length - 1; i >= 0; i--) {
				const descendant = this.scene2D.allEventDescendants[i];
				if (descendant.hitTestDisabled) {
					continue;
				}
				if (this._hitTest(descendant)) {
					if (this._mouseDownHitNode === null) {
						this._mouseDownHitNode = descendant;
					}
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
						descendant.dragUpdatePosition
					) {
						this._cacheDragPosition(descendant);

						this.dragNodes.push(descendant);
					}
				}
				if (this.hitTestLimit <= hitTestCounter) {
					break;
				}
			}

			// 根据是否有节点被命中，触发不同的场景事件
			if (hitTestCounter === 0) {
				// 没有节点被命中，触发"无命中"场景事件
				this.scene2D.executeMouseDownWhenNoNodeHitEvents(
					_canvasPositionInCamera.x,
					_canvasPositionInCamera.y,
					_canvasPositionInScene.x,
					_canvasPositionInScene.y,
				);
			}
			this.scene2D.executeMouseDownEvents(
				_canvasPositionInCamera.x,
				_canvasPositionInCamera.y,
				_canvasPositionInScene.x,
				_canvasPositionInScene.y,
			);

			if (this.camera2D.dragUpdatePosition && this.hitTestLimit > hitTestCounter) {
				this._cacheDragPosition(this.camera2D);
			}
		}
	}
	/**
	 * @param {number} offsetX
	 * @param {number} offsetY
	 */
	processMoveEvents(offsetX, offsetY) {
		if (this.scene2D && this.camera2D) {
			this._beforeProcess(this.camera2D, offsetX, offsetY);
			// ---- 判断是否发生了有效移动 ----
			if (
				!this._hasMovedAfterDown &&
				this._mouseDownScreenX !== null &&
				(offsetX !== this._mouseDownScreenX || offsetY !== this._mouseDownScreenY)
			) {
				this._hasMovedAfterDown = true;
			}

			// ---- 处理拖拽移动 ----
			if (this.dragNodes.length > 0) {
				for (let i = 0, len = this.dragNodes.length; i < len; i++) {
					const dragNode = this.dragNodes[i];
					if (dragNode.dragUpdatePosition) {
						this._updateDragPosition(dragNode);
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
				// ---- 无拖拽时执行普通的 mouseMove/Enter/Leave ----
				let hitTestCounter = 0;
				for (let i = this.scene2D.allEventDescendants.length - 1; i >= 0; i--) {
					const descendant = this.scene2D.allEventDescendants[i];
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

				// 处理 mouseLeave 事件
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

				// 根据是否有节点被命中，触发不同的场景事件
				if (hitTestCounter === 0) {
					this.scene2D.executeMouseMoveWhenNoNodeHitEvents(
						_canvasPositionInCamera.x,
						_canvasPositionInCamera.y,
						_canvasPositionInScene.x,
						_canvasPositionInScene.y,
					);
				}

				this.scene2D.executeMouseMoveEvents(
					_canvasPositionInCamera.x,
					_canvasPositionInCamera.y,
					_canvasPositionInScene.x,
					_canvasPositionInScene.y,
				);

				if (this.camera2D.isDraging) {
					this._updateDragPosition(this.camera2D);
				}
			}
		}
	}
	/**
	 * @param {number} offsetX
	 * @param {number} offsetY
	 */
	processUpEvents(offsetX, offsetY) {
		if (this.scene2D && this.camera2D) {
			this._beforeProcess(this.camera2D, offsetX, offsetY);
			// ---- 处理拖拽结束 ----
			if (this.dragNodes.length > 0 && this._hasMovedAfterDown) {
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
			} else {
				let upHitNode = null;
				let hitTestCounter = 0;
				for (let i = this.scene2D.allEventDescendants.length - 1; i >= 0; i--) {
					const descendant = this.scene2D.allEventDescendants[i];
					if (descendant.hitTestDisabled) {
						continue;
					}
					if (this._hitTest(descendant)) {
						if (upHitNode === null) {
							upHitNode = descendant;
						}
						if (descendant.hitTestCountable) {
							hitTestCounter++;
						}
						if (descendant.hasMouseUpEvents) {
							descendant.executeMouseUpEvents(
								_canvasPositionInCamera.x,
								_canvasPositionInCamera.y,
								_canvasPositionInScene.x,
								_canvasPositionInScene.y,
								this._hasMovedAfterDown,
							);
						}
					}
					if (this.hitTestLimit <= hitTestCounter) {
						break;
					}
				}

				// 根据是否有节点被命中，触发不同的场景事件
				if (hitTestCounter === 0) {
					this.scene2D.executeMouseUpWhenNoNodeHitEvents(
						_canvasPositionInCamera.x,
						_canvasPositionInCamera.y,
						_canvasPositionInScene.x,
						_canvasPositionInScene.y,
						this._hasMovedAfterDown,
					);
				}
				this.scene2D.executeMouseUpEvents(
					_canvasPositionInCamera.x,
					_canvasPositionInCamera.y,
					_canvasPositionInScene.x,
					_canvasPositionInScene.y,
					this._hasMovedAfterDown,
				);
				if (this.camera2D.isDraging) {
					this.camera2D.isDraging = false;
				}
				if (this._mouseDownHitNode !== null && this._mouseDownHitNode === upHitNode) {
					if (upHitNode.hasClickEvents) {
						upHitNode.executeClickEvents(
							_canvasPositionInCamera.x,
							_canvasPositionInCamera.y,
							_canvasPositionInScene.x,
							_canvasPositionInScene.y,
							this._hasMovedAfterDown,
						);
					}
				}
			}

			this._hasMovedAfterDown = false;
			this._mouseDownHitNode = null;
			this._mouseDownScreenX = this._mouseDownScreenY = null;
			if (this.dragNodes.length > 0) {
				this.dragNodes.length = 0;
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
		if (this.scene2D && this.camera2D) {
			this._beforeProcess(this.camera2D, offsetX, offsetY);

			let hitTestCounter = 0;

			// 遍历所有事件节点，找到最上层命中的节点，触发其 wheel 事件
			for (let i = this.scene2D.allEventDescendants.length - 1; i >= 0; i--) {
				const descendant = this.scene2D.allEventDescendants[i];
				if (descendant.hitTestDisabled) {
					continue;
				}
				if (this._hitTest(descendant)) {
					if (descendant.hitTestCountable) {
						hitTestCounter++;
					}

					if (descendant.wheelEvents && descendant.wheelEvents.length > 0) {
						descendant.executeWheelEvents(
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

				if (this.hitTestLimit <= hitTestCounter) {
					break;
				}
			}

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
