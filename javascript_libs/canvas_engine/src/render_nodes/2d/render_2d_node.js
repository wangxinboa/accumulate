import { clamp, PiDivide180 } from "../../math/math_utils.js";
import { Matrix3 } from "../../math/matrix3.js";
import { RenderEventNode } from "../render_event_node.js";

const matrix3 = new Matrix3();

/**
 * 2D 渲染节点基类，提供位置、旋转、缩放、pivot 等属性。
 *
 * 局部变换矩阵（matrix）的计算顺序：
 *   1. 平移到 pivot 中心：Translation(-width * pivotX, -height * pivotY)
 *   2. 旋转：Rotation(rotation)
 *   3. 缩放：Scale(scaleX, scaleY)
 *
 * 世界矩阵（matrixWorld）= 父节点的世界矩阵 * 本节点的局部矩阵。
 *
 * pivot 属性定义节点的"锚点"位置，用于旋转和缩放的中心。
 * 取值范围为 [-1, 1]（0 为左上角，1 为右下角，0.5 为几何中心）。
 * 超出此范围的值会被钳制到边界。
 *
 * applyCameraTransform 属性控制该节点的世界坐标是否再乘以视图矩阵。
 * 若为 true，则顶点着色器中会额外乘以 camera.matrixWorld；若为 false，则不乘。
 * 在本引擎中，大多数场景物体设为 true，相机本身设为 false。
 */
export class Render2DNode extends RenderEventNode {
	/** @type {Render2DNode | null} */
	parent = null;
	/** @type {Array<Render2DNode>} */
	children = [];
	constructor() {
		super();

		/** @type {boolean} */
		this.isRender2DNode = true;

		/** @type {boolean} */
		this.applyCameraTransform = true;

		/** @type {number} */
		this._width = 0;
		/** @type {number} */
		this._height = 0;

		/** @type {number} */
		this._x = 0;
		/** @type {number} */
		this._y = 0;
		/** @type {number} */
		this._pivotX = 0;
		/** @type {number} */
		this._pivotY = 0;
		/** @type {number} */
		this._rotation = 0;
		/** @type {number} */
		this._rotationAngle = 0;
		/** @type {number} */
		this._scaleX = 1;
		/** @type {number} */
		this._scaleY = 1;

		/** @type {number} */
		this.viewX = 0;
		/** @type {number} */
		this.viewY = 0;

		this.viewRight = 0;
		this.viewLeft = 0;
		this.viewTop = 0;
		this.viewBottom = 0;
		this.viewCenterX = 0;
		this.viewCenterY = 0;

		/** @type {Matrix3} */
		this.matrix = new Matrix3();
		/** @type {Matrix3} */
		this.matrixWorld = new Matrix3();
		/** @type {Matrix3} */
		this.matrixWorldInvert = new Matrix3();

		/** @type {CanvasEngineType.Geometry2DDef | null} */
		this.geometry = null;
		/** @protected @type {boolean} */
		this._fixedGeometry = false;
		this._updateGeometry = this._updateGeometry.bind(this);
	}
	/**
	 * 获取当前节点的渲染管道对象，子类需覆盖此方法
	 * @returns {CanvasEngineType.RenderPipe<this> | null}
	 */
	get pipe() {
		return null;
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 * @returns {boolean}
	 */
	hitTest(x, y) {
		if (this.geometry) {
			return this.geometry.containPoint(x, y);
		}
		throw new Error("Render2DNode 子类未正确初始化 geometry，无法进行命中测试");
	}

	/**
	 * @param {any} _args
	 */
	fixGeometry(..._args) {
		throw new Error("Render2DNode 子类未实现 fixGeometry 方法");
	}

	/**
	 * @protected
	 * @param {any} _args
	 */
	_updateGeometry(..._args) {
		throw new Error("Render2DNode 子类未实现 _updateGeometry 方法");
	}

	// matrix 更新
	updateMatrix() {
		if (this.matrixNeedUpdate) {
			this.matrix
				.identity()
				.multiply(matrix3.makeTranslation(this.x - this.width * this.pivotX, this.y - this.height * this.pivotY))
				.multiply(matrix3.makeRotation(this.rotation))
				.multiply(matrix3.makeScale(this.scaleX === 0 ? 0 : this.scaleX, this.scaleY === 0 ? 0 : this.scaleY));

			this._updateMatrixWorld();

			this.matrixNeedUpdate = false;
			this.worldMatrixNeedUpdate = false;
		} else if (this.worldMatrixNeedUpdate) {
			this._updateMatrixWorld();

			this.worldMatrixNeedUpdate = false;
		}
	}

	/**
	 * @param {CanvasEngineType.Camera2D} camera
	 */
	updateView(camera) {
		if (this.applyCameraTransform) {
			this.viewX = this.matrixWorld.elements[6] + camera.x;
			this.viewY = this.matrixWorld.elements[7] + camera.y;
		} else {
			this.viewX = this.matrixWorld.elements[6];
			this.viewY = this.matrixWorld.elements[7];
		}

		this.viewRight = this.viewX + this.width;
		this.viewLeft = this.viewX;
		this.viewTop = this.viewY + this.height;
		this.viewBottom = this.viewY;
		this.viewCenterX = this.viewLeft + this.width / 2;
		this.viewCenterY = this.viewBottom + this.height / 2;
	}

	/** @private */
	_updateMatrixWorld() {
		if (this.parent && this.parent.matrixWorld) {
			this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);
		} else {
			this.matrixWorld.copy(this.matrix);
		}
		this.matrixWorldInvert.copy(this.matrixWorld).invert();
	}

	/**
	 * @param {Render2DNode} renderNode2D
	 */
	add(renderNode2D) {
		super.add(renderNode2D);

		renderNode2D.worldMatrixNeedUpdate = true;
		return this;
	}

	// matrix 相关属性
	get x() {
		return this._x;
	}
	set x(val) {
		this._x = val;

		this.matrixNeedUpdate = true;
		this.worldMatrixNeedUpdate = true;
	}
	get y() {
		return this._y;
	}
	set y(val) {
		this._y = val;

		this.matrixNeedUpdate = true;
		this.worldMatrixNeedUpdate = true;
	}
	centerSelf() {
		this.pivotX = this.pivotY = 0.5;
	}
	get pivotX() {
		return this._pivotX;
	}
	set pivotX(val) {
		this._pivotX = clamp(val, -1, 1);

		this.matrixNeedUpdate = true;
		this.worldMatrixNeedUpdate = true;
	}
	get pivotY() {
		return this._pivotY;
	}
	set pivotY(val) {
		this._pivotY = clamp(val, -1, 1);

		this.matrixNeedUpdate = true;
		this.worldMatrixNeedUpdate = true;
	}
	get rotationAngle() {
		return this._rotationAngle;
	}
	set rotationAngle(val) {
		this._rotationAngle = val;
		this._rotation = val * PiDivide180;

		this.matrixNeedUpdate = true;
		this.worldMatrixNeedUpdate = true;
	}
	get rotation() {
		return this._rotation;
	}
	set rotation(val) {
		this._rotation = val;
		this._rotationAngle = val / PiDivide180;

		this.matrixNeedUpdate = true;
		this.worldMatrixNeedUpdate = true;
	}
	get scaleX() {
		return this._scaleX;
	}
	set scaleX(val) {
		this._scaleX = val;

		this.matrixNeedUpdate = true;
		this.worldMatrixNeedUpdate = true;
	}
	get scaleY() {
		return this._scaleY;
	}
	set scaleY(val) {
		this._scaleY = val;

		this.matrixNeedUpdate = true;
		this.worldMatrixNeedUpdate = true;
	}

	// 宽高
	get width() {
		return this._width;
	}
	set width(val) {
		this._width = val;
	}
	get height() {
		return this._height;
	}
	set height(val) {
		this._height = val;
	}

	destroy() {
		if (this.geometry) {
			this.geometry.destroy();
		}
		super.destroy();
	}
}
