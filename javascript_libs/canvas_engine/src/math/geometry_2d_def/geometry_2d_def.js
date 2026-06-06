import { BaseCleanUp } from "../../../../javascript_utils/javascript_utils.js";

export class Geometry2DDef extends BaseCleanUp {
	constructor() {
		super();
	}
	/**
	 * @param {number} _x
	 * @param {number} _y
	 * @returns {boolean}
	 */
	containPoint(_x, _y) {
		throw new Error("Geometry2DDef 子类未实现 containsPoint 方法");
	}
}
