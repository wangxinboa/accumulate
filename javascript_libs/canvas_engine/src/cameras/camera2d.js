import { Matrix3 } from "../math/matrix3.js";
import { Render2DNode } from "../render_nodes/2d/render_2d_node.js";

const _Matrix3_ = new Matrix3();

/**
 * 2D 相机，继承自 Render2DNode。
 *
 * 相机提供两个变换矩阵：
 *   - matrixWorld：用作视图矩阵（view matrix），将世界坐标变换到相机局部空间。
 *   - projectionMatrix：将相机局部空间坐标映射到 NDC（范围 -1 到 1）。
 *
 * 在渲染管线中，顶点着色器的变换顺序为：
 *   clip_position = projectionMatrix * matrixWorld * modelMatrix * local_position
 *
 * 因此，要控制相机位置，可设置相机的 x、y 等属性，从而改变 matrixWorld。
 * 当 camera.x = 0, camera.y = 0 且无旋转缩放时，matrixWorld 为单位矩阵，世界坐标原点到相机局部空间原点。
 *
 * 常见用法：令目标物体始终居中，可设置 camera.x = -目标.x, camera.y = -目标.y，
 * 并配合 pivot 调整（例如 pivotX = pivotY = -0.5）使视口中心对应世界原点。
 */
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
	 * 更新投影矩阵。
	 * 基于逻辑宽高和像素比，构建正交投影矩阵，将相机空间坐标映射到 NDC。
	 *
	 * 映射公式：
	 *   x_ndc = (x_camera / retinaScaling - width/2) * (2/width) * retinaScaling
	 *   y_ndc = -(y_camera / retinaScaling - height/2) * (2/height) * retinaScaling
	 *
	 * @param {number} width 逻辑宽度（CSS像素）
	 * @param {number} height 逻辑高度
	 * @param {number} retinaScaling 像素比，默认 1
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
	 * 将屏幕坐标（相对于画布左上角，单位 CSS 像素）转换为相机局部空间坐标。
	 * 转换过程：将屏幕坐标视为世界坐标，然后应用 matrixWorldInvert（视图矩阵的逆）。
	 *
	 * 注意：此方法假设屏幕坐标原点在画布左上角，Y 轴向下，且相机变换仅为平移（无旋转缩放）。
	 *
	 * @param {CanvasEngineType.Vector2} screenPoint - 要转换的屏幕坐标，转换后的坐标写回该对象
	 */
	screenToCamera(screenPoint) {
		screenPoint.applyMatrix3(this.matrixWorldInvert);
	}
}
