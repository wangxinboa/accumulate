import { Render2DNode } from "../render_2d_node.js";
import { Color } from "../../../math/color.js";
import { RectanglePipe } from "./rectangle_pipe/rectangle_pipe.js";
import { RectangleDef } from "../../../math/geometry_2d_defs/rectangle_def.js";

export class Rectangle extends Render2DNode {
	/** @type {Color} */
	color;
	/** @type {number} 缓存宽度用于buffer更新 */
	cacheBufferWidth;
	/** @type {number} 缓存高度用于buffer更新 */
	cacheBufferHeight;

	/**
	 * @param {number} width
	 * @param {number} height
	 * @param {Color} color
	 */
	constructor(width = 100, height = 100, color = new Color(1, 1, 1)) {
		super();

		this.color = color;

		this.cacheBufferWidth = -1;
		this.cacheBufferHeight = -1;

		this.geometry = new RectangleDef(0, 0, width, height);

		this.width = width;
		this.height = height;
	}

	/**
	 * 获取当前节点的渲染管道对象
	 * @returns {CanvasEngineType.RenderPipe<this>}
	 */
	get pipe() {
		return RectanglePipe;
	}

	get width() {
		return this._width;
	}
	/**
	 * 覆盖父类的 width setter，在更新宽度的同时更新几何体
	 * @param {number} val
	 */
	set width(val) {
		this._width = val;
		if (this.geometry) {
			this.geometry.max.x = val;
		}
	}

	get height() {
		return this._height;
	}
	/**
	 * 覆盖父类的 height setter，在更新高度的同时更新几何体
	 * @param {number} val
	 */
	set height(val) {
		this._height = val;
		if (this.geometry) {
			this.geometry.max.y = val;
		}
	}
	/**
	 * 静态工厂方法
	 * @param {number} width
	 * @param {number} height
	 * @param {Color} color
	 * @returns {Rectangle}
	 */
	static create(width = 100, height = 100, color = new Color(1, 1, 1)) {
		return new Rectangle(width, height, color);
	}
}
