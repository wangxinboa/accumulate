import { Color } from "../../../src/math/color.js";
import { Rectangle } from "../../../src/render_nodes/2d/rectangle/rectangle.js";

/** @type {Array<CanvasEngineType.Rectangle>} */
const rectPool = [];

/**
 * 从池中获取一个 Rectangle 实例
 * @returns {CanvasEngineType.Rectangle}
 */
export function getRectFromPool() {
	let rect = rectPool.pop();

	if (!rect) {
		rect = new Rectangle(1, 1, new Color(0, 0, 1, 0.3));
	}
	rect.hitTestDisabled = true;
	return rect;
}

/**
 * 回收一个 Rectangle 实例到池中
 * @param {CanvasEngineType.Rectangle} rect
 */
export function recycleRectToPool(rect) {
	const parent = rect.parent;
	if (parent) {
		parent.remove(rect);
	}
	rect.x = 0;
	rect.y = 0;
	rect.width = 1;
	rect.height = 1;
	rectPool.push(rect);
}
