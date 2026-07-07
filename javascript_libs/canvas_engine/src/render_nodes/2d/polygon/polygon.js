import { Render2DNode } from "../render_2d_node.js";
import { Color } from "../../../math/color.js";
import { PolygonPipe } from "./polygon_pipe/polygon_pipe.js";
import { PolygonDef } from "../../../math/geometry_2d_defs/polygon_def.js";

export class Polygon extends Render2DNode {
	/** @type {Color} */
	color;
	/** @type {number[]} 扁平坐标数组 [x1, y1, x2, y2, ...] */
	_points;
	/** @type {number} 缓存顶点数量，用于 drawArrays */
	cachedVertexCount;
	/** @type {boolean} 标记几何体是否需要更新 buffer */
	bufferNeedUpdate;

	/**
	 * @param {number[]} points - 多边形的顶点坐标（扁平数组，[x1, y1, x2, y2, ...]）
	 * @param {Color} color
	 */
	constructor(points = [], color = new Color(1, 1, 1)) {
		super();

		this.color = color;
		this._points = [];
		this.geometry = new PolygonDef([]);
		this.cachedVertexCount = 0;
		this.bufferNeedUpdate = true;

		this.setPoints(points);
	}

	/**
	 * 获取当前节点的渲染管道对象
	 * @returns {CanvasEngineType.RenderPipe<this>}
	 */
	get pipe() {
		return PolygonPipe;
	}

	/**
	 * @returns {number[]}
	 */
	get points() {
		return this._points;
	}

	/**
	 * 设置多边形的顶点，自动计算宽高并更新几何体
	 * @param {number[]} points - 扁平坐标数组 [x1, y1, x2, y2, ...]
	 * @returns {this}
	 */
	setPoints(points) {
		this._points = points;

		// 计算边界框，确定节点的宽高（每两个数一对坐标）
		let minX = Infinity,
			minY = Infinity,
			maxX = -Infinity,
			maxY = -Infinity;

		for (let i = 0; i < points.length; i += 2) {
			const x = points[i];
			const y = points[i + 1];
			if (x < minX) minX = x;
			if (y < minY) minY = y;
			if (x > maxX) maxX = x;
			if (y > maxY) maxY = y;
		}
		// 避免宽高为0导致矩阵异常
		const w = Math.max(maxX - minX, 1);
		const h = Math.max(maxY - minY, 1);
		this.width = w;
		this.height = h;

		// 更新碰撞几何体
		this.geometry.updateShape(points);

		// 标记几何体已改变，需要更新缓冲区
		this.bufferNeedUpdate = true;

		return this;
	}

	/**
	 * 静态工厂方法
	 * @param {number[]} points
	 * @param {Color} color
	 * @returns {Polygon}
	 */
	static create(points = [], color = new Color(1, 1, 1)) {
		return new Polygon(points, color);
	}
}
