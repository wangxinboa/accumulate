import { Color } from "../../../src/math/color.js";
import { Circle } from "../../../src/render_nodes/2d/circle/circle.js";

/** @type {Array<CanvasEngineType.Circle>} */
const circlePool = [];

/**
 * 从池中获取一个 Circle 实例
 * @returns {CanvasEngineType.Circle}
 */
export function getCircleFromPool() {
	let circle = circlePool.pop();

	if (!circle) {
		circle = new Circle(1, new Color(1, 1, 1, 0.8));
	}
	circle.hitTestDisabled = true;
	return circle;
}

/**
 * 回收一个 Circle 实例到池中
 * @param {CanvasEngineType.Circle} circle
 */
export function recycleCircleToPool(circle) {
	const parent = circle.parent;
	if (parent) {
		parent.remove(circle);
	}
	circle.x = 0;
	circle.y = 0;
	circlePool.push(circle);
}
