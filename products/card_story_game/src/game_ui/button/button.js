import {
	Render2DNode,
	RectangleDef,
	TextTexture,
	Color,
} from "../../../../../javascript_libs/canvas_engine/src/canvas_engine.js";

import { ButtonPipe } from "./button_pipe/button_pipe.js";

export class Button extends Render2DNode {
	/**
	 * @param {string} [title]
	 * @param {CardStoryGameType.ButtonOption} [buttonOption]
	 */
	constructor(title = "button", buttonOption) {
		super();

		this.actionId = "-1";

		this.padding = {
			left: buttonOption?.padding?.left ?? 0,
			right: buttonOption?.padding?.right ?? 0,
			top: buttonOption?.padding?.top ?? 0,
			bottom: buttonOption?.padding?.bottom ?? 0,
		};
		/** @type {Color} */
		this.bgColor = new Color(
			buttonOption?.bgColor?.r ?? 1,
			buttonOption?.bgColor?.g ?? 1,
			buttonOption?.bgColor?.b ?? 1,
			buttonOption?.bgColor?.a ?? 1,
		);
		/** @type {boolean} */
		this.fixedGeometry = buttonOption?.fixedGeometry ?? false;
		/** @type {TextTexture} */
		this.textTexture = new TextTexture(title, buttonOption?.titleTextureOption);
		this.width = this.textTexture.width + this.padding.left + this.padding.right;
		this.height = this.textTexture.height + this.padding.top + this.padding.bottom;
		this.geometry = new RectangleDef(0, 0, this.width, this.height);

		this.clickCallback = this.clickCallback.bind(this);
		this.addMouseDownEvent(this.clickCallback);
	}

	get pipe() {
		return ButtonPipe;
	}

	/**
	 * @param {CardStoryGameType.ButtonOption} [buttonOption]
	 * @param {string} [title]
	 */
	updateConfig(buttonOption, title = "button") {
		this.padding.left = buttonOption?.padding?.left ?? 0;
		this.padding.right = buttonOption?.padding?.right ?? 0;
		this.padding.top = buttonOption?.padding?.top ?? 0;
		this.padding.bottom = buttonOption?.padding?.bottom ?? 0;

		if (buttonOption?.bgColor) {
			this.bgColor.setFromJson(buttonOption.bgColor);
		}

		this.fixedGeometry = buttonOption?.fixedGeometry ?? false;

		if (title && title !== this.textTexture.text) {
			this.textTexture.text = title;
		}
		if (buttonOption?.titleTextureOption) {
			this.textTexture.udpateStyle(buttonOption.titleTextureOption);
		}

		this._updateGeometry();
	}
	_updateGeometry() {
		this.width = this.textTexture.width + this.padding.left + this.padding.right;
		this.height = this.textTexture.height + this.padding.top + this.padding.bottom;
		this.geometry.updateShape(0, 0, this.width, this.height);
	}

	/**
	 * 设置点击回调
	 * @param {Function} callback - (button: Button) => void
	 * @returns {this}
	 */
	setClickCallback(callback) {
		this._clickCallback = callback;
		return this;
	}
	/**
	 * @param {Button} button
	 * @param {number} x
	 * @param {number} y
	 * @param {number} sx
	 * @param {number} sy
	 */
	clickCallback(button, x, y, sx, sy) {
		if (this._clickCallback) {
			this._clickCallback(button, x, y, sx, sy);
		}
	}

	destroy() {
		this.textTexture.destroy();
		this.bgColor.destroy();

		super.destroy();
	}
}
