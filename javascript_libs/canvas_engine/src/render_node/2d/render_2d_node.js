import { PiDivide180 } from "../../math/math_utils.js";
import { Matrix4 } from "../../math/matrix4.js";
import { RenderNode } from "../render_node.js";

const translationMatrix4 = new Matrix4();
const rotationMatrix4 = new Matrix4();
const scaleMatrix4 = new Matrix4();

export class Render2DNode extends RenderNode {
	/** @type {Render2DNode | null} */
	parent = null;
	/** @type {boolean} */
	isRender2DNode;
	/** @type {boolean} */
	matrixNeedsUpdate;
	/** @type {Matrix4} */
	matrix;
	/** @type {Matrix4} */
	matrixWorld;
	/** @type {number} */
	_x;
	/** @type {number} */
	_y;
	/** @type {number} */
	_rotationMatrix3;
	/** @type {number} */
	_rotationAngle;
	/** @type {number} */
	_scaleX;
	/** @type {number} */
	_scaleY;

	constructor() {
		super();

		this.isRender2DNode = true;

		this.matrixNeedsUpdate = true;
		this.matrix = new Matrix4();
		this.matrixWorld = new Matrix4();

		this._x = 0;
		this._y = 0;
		this._rotationMatrix3 = 0;
		this._rotationAngle = 0;
		this._scaleX = 1;
		this._scaleY = 1;
	}
	// matrix 更新
	updateMatrix() {
		if (this.matrixNeedsUpdate) {
			translationMatrix4.makeTranslation(this.x, this.y, 0);
			rotationMatrix4.makeRotationZ(this.rotation);
			scaleMatrix4.makeScale(this.scaleX, this.scaleY, 0);

			this.matrix.identity().multiply(translationMatrix4).multiply(rotationMatrix4).multiply(scaleMatrix4);

			this.updateMatrixWorld();

			this.matrixNeedsUpdate = false;
		}
	}
	updateMatrixWorld() {
		if (this.parent && this.parent.matrixWorld) {
			this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);
		} else {
			this.matrixWorld.copy(this.matrix);
		}
	}
	// matrix 相关属性
	get x() {
		return this._x;
	}
	set x(val) {
		this._x = val;
		this.matrixNeedsUpdate = true;
	}
	get y() {
		return this._y;
	}
	set y(val) {
		this._y = val;
		this.matrixNeedsUpdate = true;
	}
	get rotationAngle() {
		return this._rotationAngle;
	}
	set rotationAngle(val) {
		this._rotationAngle = val;
		this._rotationMatrix3 = val * PiDivide180;

		this.matrixNeedsUpdate = true;
	}
	get rotation() {
		return this._rotationMatrix3;
	}
	set rotation(val) {
		this._rotationMatrix3 = val;
		this._rotationAngle = val / PiDivide180;

		this.matrixNeedsUpdate = true;
	}
	get scaleX() {
		return this._scaleX;
	}
	set scaleX(val) {
		this._scaleX = val;
		this.matrixNeedsUpdate = true;
	}
	get scaleY() {
		return this._scaleY;
	}
	set scaleY(val) {
		this._scaleY = val;
		this.matrixNeedsUpdate = true;
	}
}
