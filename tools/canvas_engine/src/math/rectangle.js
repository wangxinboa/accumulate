import Matrix3 from "./matrix3.js";
import Vector2 from "./vector2.js";

const _leftTop = new Vector2();
const _rightTop = new Vector2();
const _rightBottom = new Vector2();
const _leftBottom = new Vector2();

const _point = new Vector2();
const _matrx = new Matrix3();

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
	constructor(minX = 0, minY = 0, maxX = 0, maxY = 0) {
		this.min = new Vector2(minX, minY);
		this.max = new Vector2(maxX, maxY);

		this.leftTop = new Vector2(minX, maxY);
		this.rightTop = new Vector2(maxX, maxY);
		this.rightBottom = new Vector2(maxX, minY);
		this.leftBottom = new Vector2(minX, minY);

		this.topEdge = new Vector2(maxX - minX, 0);
		this.rightEdge = new Vector2(0, minY - maxY);
		this.bottomEdge = new Vector2(minX - maxX, 0);
		this.leftEdge = new Vector2(0, maxY - minY);

		this.topEdgeNormal = new Vector2(this.topEdge.y, -this.topEdge.x).normalize();
		this.rightEdgeNormal = new Vector2(this.rightEdge.y, -this.rightEdge.x).normalize();
		this.bottomEdgeNormal = new Vector2(this.bottomEdge.y, -this.bottomEdge.x).normalize();
		this.leftEdgeNormal = new Vector2(this.leftEdge.y, -this.leftEdge.x).normalize();
	}

	setRectangle(minX = 0, minY = 0, maxX = 0, maxY = 0, matrix) {
		this.min.set(minX, minY);
		this.max.set(maxX, maxY);

		this.applyMatrix3(matrix);
	}

	setRectangleByPoints(points, matrix) {
		points.forEach((point) => {
			const { x, y } = point;
			if (x > this.max.x) {
				this.max.x = x;
			}
			if (y > this.max.y) {
				this.max.y = y;
			}
			if (x < this.min.x) {
				this.min.x = x;
			}
			if (y < this.min.y) {
				this.min.y = y;
			}
		});

		this.applyMatrix3(matrix);
	}

	applyMatrix3(matrix) {
		this.leftTop.copy(_leftTop.set(this.min.x, this.max.y).applyMatrix3(matrix));
		this.rightTop.copy(_rightTop.set(this.max.x, this.max.y).applyMatrix3(matrix));
		this.rightBottom.copy(_rightBottom.set(this.max.x, this.min.y).applyMatrix3(matrix));
		this.leftBottom.copy(_leftBottom.set(this.min.x, this.min.y).applyMatrix3(matrix));

		this.updateEdges();
	}

	updateEdges() {
		this.topEdge.copy(this.rightTop).sub(this.leftTop);
		this.rightEdge.copy(this.rightBottom).sub(this.rightTop);
		this.bottomEdge.copy(this.leftBottom).sub(this.rightBottom);
		this.leftEdge.copy(this.leftTop).sub(this.leftBottom);

		this.topEdgeNormal.set(this.topEdge.y, -this.topEdge.x).normalize();
		this.rightEdgeNormal.set(this.rightEdge.y, -this.rightEdge.x).normalize();
		this.bottomEdgeNormal.set(this.bottomEdge.y, -this.bottomEdge.x).normalize();
		this.leftEdgeNormal.set(this.leftEdge.y, -this.leftEdge.x).normalize();
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

	containsPoint(x, y, matrx) {
		_point.set(x, y).applyMatrix3(_matrx.copy(matrx).invert());
		return (
			this.min.x < _point.x &&
			this.max.x > _point.x &&
			this.min.y < _point.y &&
			this.max.y > _point.y
		)
	}
}