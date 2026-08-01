import { BaseCleanUp } from "../../../javascript_utils/javascript_utils.js";
import { getHexR, getHexG, getHexB, rgbToHexString } from "./math_utils.js";

/** @type {Color} */
let _color;

export class Color extends BaseCleanUp {
	/** @type {number} */
	r;
	/** @type {number} */
	g;
	/** @type {number} */
	b;
	/** @type {number} */
	a;
	/** @type {number[]} */
	array;
	/** @private @type {string} 带 # 的十六进制颜色字符串，如 "#ff0000" */
	_hexString;

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

		this._hexString = rgbToHexString(this.r, this.g, this.b);
	}

	/**
	 * 设置 RGBA 分量值
	 * @param {number} r
	 * @param {number} g
	 * @param {number} b
	 * @param {number} a
	 * @returns {this}
	 */
	setValue(r, g, b, a) {
		this.r = this.array[0] = r;
		this.g = this.array[1] = g;
		this.b = this.array[2] = b;
		this.a = this.array[3] = a;
		this._hexString = rgbToHexString(this.r, this.g, this.b);
		return this;
	}

	/**
	 * @param {number} a
	 */
	setAlpha(a) {
		this.a = this.array[3] = a;
	}

	get hexString() {
		return this._hexString;
	}
	/**
	 * 设置颜色（传入带 # 的十六进制字符串，如 "#ff0000"）
	 * @param {string} hexStringValue - 必须包含 # 前缀
	 */
	set hexString(hexStringValue) {
		if (typeof hexStringValue !== "string" || !hexStringValue.startsWith("#")) {
			throw new Error('setHexString: 参数必须是带 # 前缀的字符串，如 "#ff0000"');
		}
		const hexStringWithoutHash = hexStringValue.slice(1);

		if (hexStringWithoutHash.length !== 6) {
			throw new Error('setHexStringWithoutHash: 参数必须是 6 位十六进制字符串，如 "ff0000"');
		}
		const num = parseInt(hexStringWithoutHash, 16);
		if (isNaN(num)) {
			throw new Error(`set hexString: 无效的十六进制字符串 "${hexStringWithoutHash}"`);
		}

		this._hexString = hexStringValue;
		this.r = this.array[0] = getHexR(num);
		this.g = this.array[1] = getHexG(num);
		this.b = this.array[2] = getHexB(num);
	}

	/**
	 * 从十六进制数字创建 Color 实例
	 * @param {number} hex
	 * @returns {Color}
	 */
	static createFromHex(hex = 0) {
		return new Color(getHexR(hex), getHexG(hex), getHexB(hex));
	}

	/**
	 * 设置颜色（传入带 # 的十六进制字符串，如 "#ff0000"）
	 * @param {string} hexStringValue - 必须包含 # 前缀
	 */
	static createFromHexString(hexStringValue) {
		_color = new Color();
		_color.hexString = hexStringValue;
		return _color;
	}
}
