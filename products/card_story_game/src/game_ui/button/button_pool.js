import { Color } from "../../../../../javascript_libs/canvas_engine/src/math/color.js";
import { Button } from "./button.js";

export class ButtonPool {
	constructor() {
		/** @type {Array<Button>} */
		this._pool = [];
	}

	/**
	 * @param {Object} config
	 * @param {number} config.actionId
	 * @param {string} config.label
	 * @param {number} config.width
	 * @param {number} config.height
	 * @param {Color} config.bgColor
	 * @param {Color} config.textColor
	 * @param {number} config.fontSize
	 * @param {string} config.fontFamily
	 * @param {Object} config.padding
	 * @param {number} config.padding.left
	 * @param {number} config.padding.right
	 * @param {number} config.padding.top
	 * @param {number} config.padding.bottom
	 * @returns {Button}
	 */
	acquire(config) {
		let button = this._pool.pop();
		if (!button) {
			button = new Button(config);
		} else {
			button.actionId = config.actionId;
			button.label = config.label;
			button.setSize(config.width, config.height);
			button.padding = config.padding || { left: 8, right: 8, top: 4, bottom: 4 };
			button.bgColor.setValue(config.bgColor.r, config.bgColor.g, config.bgColor.b, config.bgColor.a);
			button.textColor.setValue(config.textColor.r, config.textColor.g, config.textColor.b, config.textColor.a);
			if (button.textTexture) {
				button.textTexture.text = config.label;
				button.textTexture.fontSize = config.fontSize;
				button.textTexture.fontFamily = config.fontFamily;
				button.textTexture.text = config.label;
			}
			button._clickCallback = null;
		}
		return button;
	}

	/**
	 * @param {Button} button
	 */
	release(button) {
		if (button.parent) {
			button.parent.remove(button);
		}
		button.reset();
		this._pool.push(button);
	}

	clear() {
		for (let i = 0, len = this._pool.length; i < len; i++) {
			this._pool[i].destroy();
		}
		this._pool.length = 0;
	}
}
