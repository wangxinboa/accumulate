import { Matrix3 } from "../math/matrix3.js";
import { Render2DNode } from "../render_nodes/2d/render_2d_node.js";

const _Matrix3_ = new Matrix3();

export class Camera2D extends Render2DNode {
	/** @type {number} */
	retinaScaling;
	/** @type {Matrix3} */
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
	 * @param {number} width
	 * @param {number} height
	 * @param {number} retinaScaling
	 */
	updateProjection(width, height, retinaScaling = 1) {
		this.width = width;
		this.height = height;
		this.retinaScaling = retinaScaling;

		this.projectionMatrix
			.identity()
			.multiply(_Matrix3_.makeScale(retinaScaling / width, -retinaScaling / height))
			.multiply(_Matrix3_.makeTranslation(-width / retinaScaling, -height / retinaScaling));
	}
	/**
	 * @param {CanvasEngineType.Vector2} screenPoint - 要转换的屏幕坐标，转换后的世界坐标将写回该对象
	 */
	screenToCamera(screenPoint) {
		screenPoint.applyMatrix3(this.matrixWorldInvert);
	}
}
