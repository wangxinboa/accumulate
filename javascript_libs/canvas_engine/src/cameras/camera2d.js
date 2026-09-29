import { Matrix3 } from "../math/matrix3.js";
import { Render2DNode } from "../render_nodes/2d/render_2d_node.js";

export class Camera2D extends Render2DNode {
	/** @type {number} 设备像素比，用于缩放投影 */
	retinaScaling;
	/** @type {Matrix3} 正交投影矩阵 */
	projectionMatrix;

	constructor() {
		super();
		this.applyCameraTransform = false;
		this.projectionMatrix = new Matrix3();
		this.width = 0;
		this.height = 0;
		this.retinaScaling = 1;
	}

	/**
	 * @param {number} width 逻辑宽度（CSS像素）
	 * @param {number} height 逻辑高度（CSS像素）
	 * @param {number} retinaScaling 像素比，当前未使用，默认 1
	 */
	updateProjection(width, height, retinaScaling = 1) {
		this.width = width;
		this.height = height;
		this.retinaScaling = retinaScaling;

		this.projectionMatrix.identity().makeScale(2 / width, 2 / height);
	}

	/**
	 * @param {CanvasEngineType.Vector2} screenPoint
	 */
	screenToCamera(screenPoint) {
		screenPoint.applyMatrix3(this.matrixWorldInvert);
	}
}
