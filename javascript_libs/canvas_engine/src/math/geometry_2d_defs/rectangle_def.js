import { Vector2 } from "../vector2.js";
import { Geometry2DDef } from "./geometry_2d_def.js";

export class RectangleDef extends Geometry2DDef {
	constructor(minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity) {
		super();

		this.min = new Vector2(minX, minY);
		this.max = new Vector2(maxX, maxY);
	}
	updateShape(minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity) {
		this.min.x = minX;
		this.min.y = minY;
		this.max.x = maxX;
		this.max.y = maxY;
	}
	/**
	 * @param {number} x
	 * @param {number} y
	 * @returns {boolean}
	 */
	containPoint(x, y) {
		return this.min.x <= x && this.max.x >= x && this.min.y <= y && this.max.y >= y;
	}

	/**
	 * 检测两个轴对齐矩形（AABB）是否重叠。
	 * 每个矩形由最小/最大坐标定义。
	 *
	 * @param {number} minX1 - 第一个矩形的最小 X 坐标。
	 * @param {number} minY1 - 第一个矩形的最小 Y 坐标。
	 * @param {number} maxX1 - 第一个矩形的最大 X 坐标。
	 * @param {number} maxY1 - 第一个矩形的最大 Y 坐标。
	 * @param {number} minX2 - 第二个矩形的最小 X 坐标。
	 * @param {number} minY2 - 第二个矩形的最小 Y 坐标。
	 * @param {number} maxX2 - 第二个矩形的最大 X 坐标。
	 * @param {number} maxY2 - 第二个矩形的最大 Y 坐标。
	 * @returns {boolean} 如果两个矩形重叠，返回 true。
	 */
	static isOverlapWithRectangle(minX1, minY1, maxX1, maxY1, minX2, minY2, maxX2, maxY2) {
		// 只要任一方向没有重叠，则两个矩形一定不相交
		return !(maxX1 < minX2 || minX1 > maxX2 || maxY1 < minY2 || minY1 > maxY2);
	}
}
