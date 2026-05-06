import { BaseCleanUp } from "../../../../javascript_utils/javascript_utils.js";

export class TextTexture extends BaseCleanUp {
	/** @type {boolean} */
	isTextTexture;
	/** @type {string} */
	text;
	/** @type {boolean} */
	isBind;
	/**
	 * @param {string} text
	 */
	constructor(text) {
		super();

		this.isTextTexture = true;
		this.text = text;

		this.isBind = false;
	}
}
