import { BaseCleanUp } from "../../../javascript_utils/javascript_utils.js";
import { getHexR, getHexG, getHexB } from "./math_utils.js";

export class Color extends BaseCleanUp {
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
	 * @param {number} a
	 */
	constructor(r = 1, g = 1, b = 1, a = 1) {
		super();

		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;

		this.array = [this.r, this.g, this.b, this.a];
	}
	/**
	 * @param {number} hex
	 */
	setFromHex(hex) {
		this.r = this.array[0] = getHexR(hex);
		this.g = this.array[1] = getHexG(hex);
		this.b = this.array[2] = getHexB(hex);

		return this;
	}

	/**
	 * @param {number} r
	 * @param {number} g
	 * @param {number} b
	 * @param {number} a
	 */
	setValue(r, g, b, a) {
		this.r = this.array[0] = r;
		this.g = this.array[1] = g;
		this.b = this.array[2] = b;
		this.a = this.array[3] = a;

		return this;
	}

	/**
	 * @param {number} hex
	 */
	static createFromHex(hex = 0) {
		return new Color(getHexR(hex), getHexG(hex), getHexB(hex));
	}
}
