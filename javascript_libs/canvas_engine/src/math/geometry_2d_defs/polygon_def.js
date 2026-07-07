import { Geometry2DDef } from "./geometry_2d_def.js";
import { sign } from "../math_utils.js";

/**
 * 判断点 q 是否在三角形 (a, b, c) 内
 * @param {{x: number, y: number}} q
 * @param {{x: number, y: number}} a
 * @param {{x: number, y: number}} b
 * @param {{x: number, y: number}} c
 * @returns {boolean}
 */
function pointInTriangle(q, a, b, c) {
	const d1 = sign(q, a, b);
	const d2 = sign(q, b, c);
	const d3 = sign(q, c, a);
	const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
	const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
	return !(hasNeg && hasPos);
}

/**
 * 将多边形顶点三角剖分（支持凸多边形和凹多边形）
 * 输入和输出均为扁平数组 [x1, y1, x2, y2, ...]
 * @param {number[]} points - 扁平坐标数组 [x1, y1, x2, y2, ...]
 * @returns {number[]} 三角剖分后的扁平顶点数据 [x1, y1, x2, y2, ...]
 */
function earcutTriangulate(points) {
	const n = points.length / 2;
	if (n < 3) return [];

	// 将扁平数组转换为对象数组以便处理
	const vertices = [];
	for (let i = 0; i < points.length; i += 2) {
		vertices.push({ x: points[i], y: points[i + 1] });
	}

	const triangles = [];
	let pts = vertices.map((v) => ({ x: v.x, y: v.y }));

	// 确保顶点顺序为顺时针（便于后续叉积判断凸顶点）
	let area = 0;
	for (let i = 0; i < n; i++) {
		const j = (i + 1) % n;
		area += pts[i].x * pts[j].y - pts[j].x * pts[i].y;
	}
	if (area < 0) pts.reverse();

	while (pts.length > 3) {
		let found = false;
		for (let i = 0; i < pts.length; i++) {
			const prev = (i - 1 + pts.length) % pts.length;
			const next = (i + 1) % pts.length;
			const p = pts[i];
			const p1 = pts[prev];
			const p2 = pts[next];

			// 检查是否为凸顶点（对于顺时针多边形，叉积 > 0 表示凸）
			const cross = (p.x - p1.x) * (p2.y - p1.y) - (p.y - p1.y) * (p2.x - p1.x);
			if (cross < 0) continue; // 凹顶点，跳过

			// 检查三角形 (p1, p, p2) 内是否包含其他顶点
			let isEar = true;
			for (let j = 0; j < pts.length; j++) {
				if (j === i || j === prev || j === next) continue;
				const q = pts[j];
				if (pointInTriangle(q, p1, p, p2)) {
					isEar = false;
					break;
				}
			}
			if (isEar) {
				triangles.push(p1, p, p2);
				pts.splice(i, 1);
				found = true;
				break;
			}
		}
		if (!found) break; // 防止死循环
	}
	if (pts.length === 3) {
		triangles.push(pts[0], pts[1], pts[2]);
	}

	// 将三角形对象数组转换为扁平数组
	const flat = [];
	for (let i = 0; i < triangles.length; i++) {
		flat.push(triangles[i].x, triangles[i].y);
	}
	return flat;
}

export class PolygonDef extends Geometry2DDef {
	/** @type {number[]} 扁平坐标数组 [x1, y1, x2, y2, ...] 原始顶点 */
	points;
	/** @type {number[]} 三角剖分后的扁平顶点数据 [x1, y1, x2, y2, ...] */
	triangles;

	/**
	 * @param {number[]} points - 扁平坐标数组 [x1, y1, x2, y2, ...]
	 */
	constructor(points = []) {
		super();
		this.points = [];
		this.triangles = [];
		this.updateShape(points);
	}

	/**
	 * @param {number[]} points - 扁平坐标数组 [x1, y1, x2, y2, ...]
	 */
	updateShape(points) {
		this.points = points;
		if (points.length < 6) {
			// 至少3个点，每个点2个坐标
			this.triangles = [];
			return;
		}
		this.triangles = earcutTriangulate(points);
	}

	/**
	 * 使用射线投射算法检测点是否在多边形内（支持凸凹多边形）
	 * @param {number} x
	 * @param {number} y
	 * @returns {boolean}
	 */
	containPoint(x, y) {
		let inside = false;
		const n = this.points.length / 2;
		if (n < 3) return false;
		for (let i = 0, j = n - 1; i < n; j = i++) {
			const xi = this.points[i * 2],
				yi = this.points[i * 2 + 1];
			const xj = this.points[j * 2],
				yj = this.points[j * 2 + 1];
			const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
			if (intersect) inside = !inside;
		}
		return inside;
	}
}
