import Vector2 from "./vector2.js";

const _leftTop = new Vector2();
const _rightTop = new Vector2();
const _rightBottom = new Vector2();
const _leftBottom = new Vector2();

function project(vertices, axis) {
	let min = Infinity, max = -Infinity;
	for (const v of vertices) {
		const proj = v.dot(axis);
		min = Math.min(min, proj);
		max = Math.max(max, proj);
	}
	return { min, max };
}

export default class Rectangle {
	constructor(ltx = 0, lty = 0, rtx = 0, rty = 0, rbx = 0, rxy = 0, lbx = 0, lby = 0) {
		this.originalLeftTop = new Vector2(ltx, lty);
		this.originalRightTop = new Vector2(rtx, rty);
		this.originalRightBottom = new Vector2(rbx, rxy);
		this.originalLeftBottom = new Vector2(lbx, lby);

		this.leftTop = new Vector2(ltx, lty);
		this.rightTop = new Vector2(rtx, rty);
		this.rightBottom = new Vector2(rbx, rxy);
		this.leftBottom = new Vector2(lbx, lby);

		this.topEdge = new Vector2(rtx - ltx, rty - lty);
		this.rightEdge = new Vector2(rbx - rtx, rxy - rty);
		this.bottomEdge = new Vector2(lbx - rbx, lby - rxy);
		this.leftEdge = new Vector2(ltx - lbx, lty - lby);

		this.topEdgeNormal = new Vector2(lty - rty, rtx - ltx).normalize();;
		this.rightEdgeNormal = new Vector2(rty - rxy, rbx - rtx).normalize();;
		this.bottomEdgeNormal = new Vector2(rxy - lby, lbx - rbx).normalize();;
		this.leftEdgeNormal = new Vector2(lby - lty, ltx - lbx).normalize();;
	}

	setRectangle(ltx = 0, lty = 0, rtx = 0, rty = 0, rbx = 0, rxy = 0, lbx = 0, lby = 0, matrix) {
		this.originalLeftTop.set(ltx, lty);
		this.originalRightTop.set(rtx, rty);
		this.originalRightBottom.set(rbx, rxy);
		this.originalLeftBottom.set(lbx, lby);

		this.applyMatrix3(matrix);

		this.topEdge.copy(this.rightTop).sub(this.leftTop);
		this.rightEdge.copy(this.rightBottom).sub(this.rightTop);
		this.bottomEdge.copy(this.leftBottom).sub(this.rightBottom);
		this.leftEdge.copy(this.leftTop).sub(this.leftBottom);

		this.topEdgeNormal.set(this.topEdge.y, -this.topEdge.x).normalize();
		this.rightEdgeNormal.set(this.rightEdge.y, -this.rightEdge.x).normalize();
		this.bottomEdgeNormal.set(this.bottomEdge.y, -this.bottomEdge.x).normalize();
		this.leftEdgeNormal.set(this.leftEdge.y, -this.leftEdge.x).normalize();
	}

	applyMatrix3(matrix) {
		this.leftTop.copy(_leftTop.copy(this.originalLeftTop).applyMatrix3(matrix));
		this.rightTop.copy(_rightTop.copy(this.originalRightTop).applyMatrix3(matrix));
		this.rightBottom.copy(_rightBottom.copy(this.originalRightBottom).applyMatrix3(matrix));
		this.leftBottom.copy(_leftBottom.copy(this.originalLeftBottom).applyMatrix3(matrix));
	}
	// 分离轴定理(Separating Axis Theorem)判断是否和其他矩形存在重叠
	overlapRectangleSAT(rectangle) {
		const thisCorners = [this.leftTop, this.rightTop, this.rightBottom, this.leftBottom];
		const rectangleCorners = [rectangle.leftTop, rectangle.rightTop, rectangle.rightBottom, rectangle.leftBottom];
		const axes = [
			this.topEdgeNormal, this.rightEdgeNormal, this.bottomEdgeNormal, this.leftEdgeNormal,
			rectangle.topEdgeNormal, rectangle.rightEdgeNormal, rectangle.bottomEdgeNormal, rectangle.leftEdgeNormal,
		];
		for (const axis of axes) {
			const projA = project(thisCorners, axis);
			const projB = project(rectangleCorners, axis);
			if (projA.max < projB.min || projB.max < projA.min) {
				return false;
			}
		}
		return true;
	}
}