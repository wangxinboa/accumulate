import { Matrix4 } from "../math/matrix4.js";
import { Vector2 } from "../math/vector2.js"; // 新增：引入 Vector2
import { Render2DNode } from "../render_nodes/2d/render_2d_node.js";

const _matrix4_ = new Matrix4();

export class Camera2D extends Render2DNode {
	/** @type {number} */
	retinaScaling;
	/** @type {Matrix4} */
	projectionMatrix;
	constructor() {
		super();
		this.applyCameraTransform = false;

		this.projectionMatrix = new Matrix4();

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
			.multiply(_matrix4_.makeScale(retinaScaling / width, -retinaScaling / height, 1))
			.multiply(_matrix4_.makeTranslation(-width / retinaScaling, -height / retinaScaling, 0));
	}
	/**
	 * @param {Vector2} screenPoint - 要转换的屏幕坐标，转换后的世界坐标将写回该对象
	 */
	screenToCamera(screenPoint) {
		screenPoint.applyMatrix3(this.matrix3WorldInvert);
	}
}
