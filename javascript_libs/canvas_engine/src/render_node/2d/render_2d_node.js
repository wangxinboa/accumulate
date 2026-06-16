import { clamp, PiDivide180 } from "../../math/math_utils.js";
import { Matrix3 } from "../../math/matrix3.js";
import { Matrix4 } from "../../math/matrix4.js";
import { RenderEventNode } from "../render_event_node.js";

const matrix4 = new Matrix4();
const matrix3 = new Matrix3();

export class Render2DNode extends RenderEventNode {
	/** @type {Render2DNode | null} */
	parent = null;
	/** @type {boolean} */
	isRender2DNode;
	/** @type {boolean} */
	applyCameraTransform;
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
	/** @type {number} */
	_width;
	/** @type {number} */
	_height;
	/** @type {CanvasEngineType.Geometry2DDef | null} */
	geometry;
	constructor() {
		super();

		this.isRender2DNode = true;

		this.applyCameraTransform = true;

		this._width = 0;
		this._height = 0;

		this._x = 0;
		this._y = 0;
		this._pivotX = 0;
		this._pivotY = 0;
		this._rotationMatrix3 = 0;
		this._rotationAngle = 0;
		this._scaleX = 1;
		this._scaleY = 1;

		this.matrix3WorldInvert = new Matrix3();

		this.geometry = null;
		this._updateGeometry = this._updateGeometry.bind(this);
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
		throw new Error("Render2DNode 形状 geometry 信息不存在");
	}
	/**
	 * @param {any} _args
	 */
	fixGeometry(..._args) {
		throw new Error("Render2DNode 子类未实现 fixGeometry 方法");
	}
	/**
	 * @protected
	 */
	_updateGeometry() {
		throw new Error("Render2DNode 子类未实现 _updateGeometry 方法");
	}
	// matrix 更新
	updateMatrix() {
		if (this.matrixNeedsUpdate) {
			this.matrix
				.identity()
				.multiply(matrix4.makeTranslation(this.x - this.width * this.pivotX, this.y - this.height * this.pivotY, 0))
				.multiply(matrix4.makeRotationZ(this.rotation))
				.multiply(matrix4.makeScale(this.scaleX, this.scaleY, 0));

			this.matrix3WorldInvert
				.identity()
				.multiply(matrix3.makeTranslation(this.x - this.width * this.pivotX, this.y - this.height * this.pivotY))
				.multiply(matrix3.makeRotation(this.rotation))
				.multiply(matrix3.makeScale(this.scaleX === 0 ? 0 : this.scaleX, this.scaleY === 0 ? 0 : this.scaleY))
				.invert();

			if (this.parent && this.parent.matrixWorld) {
				this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);
			} else {
				this.matrixWorld.copy(this.matrix);
			}

			this.matrixNeedsUpdate = false;
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
	get pivotX() {
		return this._pivotX;
	}
	set pivotX(val) {
		this._pivotX = clamp(val, 0, 1);
		this.matrixNeedsUpdate = true;
	}
	get pivotY() {
		return this._pivotY;
	}
	set pivotY(val) {
		this._pivotY = clamp(val, 0, 1);
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
	// 子类方法
	/**
	 * @param {CanvasEngineType.WebGL2DRenderer["programSystem"]} _programSystem
	 */
	getGlProgram(_programSystem) {
		throw new Error("Render2DNode 子类未实现 getGlProgram 方法");
	}
	/**
	 * @param {CanvasEngineType.WebGL2DRenderer["bufferSystem"]} _bufferSystem
	 */
	updateAttribs(_bufferSystem) {
		throw new Error("Render2DNode 子类未实现 updateAttribs 方法");
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} _gl
	 * @param {CanvasEngineType.WebGL2DRenderer["bufferSystem"]} _bufferSystem
	 */
	updateBuffers(_gl, _bufferSystem) {
		throw new Error("Render2DNode 子类未实现 updateBuffers 方法");
	}
	/**
	 * @param {CanvasEngineType.WebGL2DRenderer["textureSystem"]} _textureSystem
	 */
	updateTextures(_textureSystem) {
		throw new Error("Render2DNode 子类未实现 updateTextures 方法");
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} _gl
	 * @param {CanvasEngineType.WebGL2DRenderer["textureSystem"]} _textureSystem
	 * @param {CanvasEngineType.GlProgram} _glProgram
	 */
	uniform(_gl, _textureSystem, _glProgram) {
		throw new Error("Render2DNode 子类未实现 uniform 方法");
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} _gl
	 * @param {CanvasEngineType.GlProgram} _glProgram
	 */
	drawArrays(_gl, _glProgram) {
		throw new Error("Render2DNode 子类未实现 drawArrays 方法");
	}
}
