import { Matrix4 } from "../math/matrix4.js";
import { Render2DNode } from "../render_node/2d/render_2d_node.js";

const _matrix4_ = new Matrix4();

export class Camera2D extends Render2DNode {
	/** @type {Matrix4} */
	projectionMatrix;
	/** @type {number} */
	width;
	/** @type {number} */
	height;
	constructor() {
		super();

		this.projectionMatrix = new Matrix4();

		this.width = 0;
		this.height = 0;
	}
	/**
	 * @param {number} width
	 * @param {number} height
	 * @param {number} retinaScaling
	 */
	updateProjection(width, height, retinaScaling = 1) {
		this.width = width;
		this.height = height;

		this.projectionMatrix
			.identity()
			.multiply(_matrix4_.makeScale(retinaScaling / width, -retinaScaling / height, 1))
			.multiply(_matrix4_.makeTranslation(-width / retinaScaling, -height / retinaScaling, 0));
	}
}
