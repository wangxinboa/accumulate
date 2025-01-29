import Vector2 from "./vector2.js";

const _leftTop = new Vector2();
const _rightTop = new Vector2();
const _rightBottom = new Vector2();
const _leftBottom = new Vector2();

export default class Rectangle {
	constructor(ltx = 0, lty = 0, rtx = 0, rty = 0, rbx = 0, rxy = 0, lbx = 0, lby = 0) {
		this.leftTop = new Vector2(ltx, lty);
		this.rightTop = new Vector2(rtx, rty);
		this.rightBottom = new Vector2(rbx, rxy);
		this.leftBottom = new Vector2(lbx, lby);

		this.originalLeftTop = new Vector2(ltx, lty);
		this.originalRightTop = new Vector2(rtx, rty);
		this.originalRightBottom = new Vector2(rbx, rxy);
		this.originalLeftBottom = new Vector2(lbx, lby);
	}

	setPoints(ltx = 0, lty = 0, rtx = 0, rty = 0, rbx = 0, rxy = 0, lbx = 0, lby = 0, matrix) {
		this.originalLeftTop.set(ltx, lty);
		this.originalRightTop.set(rtx, rty);
		this.originalRightBottom.set(rbx, rxy);
		this.originalLeftBottom.set(lbx, lby);

		this.applyMatrix3(matrix);
	}

	applyMatrix3(matrix) {
		this.leftTop.copy(_leftTop.copy(this.originalLeftTop).applyMatrix3(matrix));
		this.rightTop.copy(_rightTop.copy(this.originalRightTop).applyMatrix3(matrix));
		this.rightBottom.copy(_rightBottom.copy(this.originalRightBottom).applyMatrix3(matrix));
		this.leftBottom.copy(_leftBottom.copy(this.originalLeftBottom).applyMatrix3(matrix));
	}
}