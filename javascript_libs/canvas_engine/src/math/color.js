import { getHexR, getHexG, getHexB } from "./math_utils.js";

export class Color {
	/** @type {number} */
	r;
	/** @type {number} */
	g;
	/** @type {number} */
	b;
	/**
	 * @param {number} r
	 * @param {number} g
	 * @param {number} b
	 */
	constructor(r = 1, g = 1, b = 1) {
		this.r = r;
		this.g = g;
		this.b = b;
	}
	/**
	 * @param {number} hex
	 */
	setFromHex(hex) {
		this.r = getHexR(hex);
		this.g = getHexG(hex);
		this.b = getHexB(hex);

		return this;
	}
	/**
	 * @param {number} hex
	 */
	static createFromHex(hex = 0) {
		return new Color(getHexR(hex), getHexG(hex), getHexB(hex));
	}
}
