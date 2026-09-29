import {
	Render2DNode,
	RectangleDef,
	TextTexture,
	Color,
} from "../../../../../../javascript_libs/canvas_engine/src/canvas_engine.js";
import { CardPanelButtonPipe } from "./card_panel_button_pipe/card_panel_button_pipe.js";

export class CardPanelButton extends Render2DNode {
	/**
	 * @param {string} [title]
	 * @param {CardStoryGameType.CardPanelButtonOption} [buttonOption]
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

		/** @type {Color} 当前渲染用背景色，根据 isSelected 在 normalBgColor / selectedBgColor 之间切换 */
		this.bgColor = new Color();
		/** @type {CardStoryGameType.RgbaColor} 未选中时的背景色 */
		this.normalBgColor = buttonOption?.bgColor ?? { r: 1, g: 1, b: 1, a: 1 };
		/** @type {CardStoryGameType.RgbaColor} 选中时的背景色 */
		this.selectedBgColor = buttonOption?.selectedBgColor ?? { r: 1, g: 1, b: 1, a: 1 };
		/** @type {boolean} 是否处于选中态 */
		this.isSelected = false;

		/** @type {boolean} */
		this.fixedGeometry = buttonOption?.fixedGeometry ?? false;
		/** @type {TextTexture} */
		this.textTexture = new TextTexture(title, buttonOption?.titleTextureOption);
		this.width = this.textTexture.width + this.padding.left + this.padding.right;
		this.height = this.textTexture.height + this.padding.top + this.padding.bottom;
		this.geometry = new RectangleDef(0, 0, this.width, this.height);

		this.unselect();

		this.clickCallback = this.clickCallback.bind(this);
		this.addMouseDownEvent(this.clickCallback);
	}

	get pipe() {
		return CardPanelButtonPipe;
	}

	/**
	 * @param {CardStoryGameType.CardPanelButtonOption} [buttonOption]
	 * @param {string} [title]
	 */
	updateConfig(buttonOption, title = "button") {
		this.padding.left = buttonOption?.padding?.left ?? 0;
		this.padding.right = buttonOption?.padding?.right ?? 0;
		this.padding.top = buttonOption?.padding?.top ?? 0;
		this.padding.bottom = buttonOption?.padding?.bottom ?? 0;

		if (buttonOption?.bgColor) {
			this.normalBgColor = buttonOption.bgColor;
		}
		if (buttonOption?.selectedBgColor) {
			this.selectedBgColor = buttonOption.selectedBgColor;
		}
		this._syncRenderBgColor();

		this.fixedGeometry = buttonOption?.fixedGeometry ?? false;

		if ((title && title !== this.textTexture.text) || buttonOption?.titleTextureOption) {
			this.textTexture.updateTextAndStyle(title, buttonOption?.titleTextureOption ?? {});
		}

		this._updateGeometry();
	}

	/**
	 * @private
	 */
	_syncRenderBgColor() {
		const color = this.isSelected ? this.selectedBgColor : this.normalBgColor;
		this.bgColor.setFromJson(color);
	}

	/**
	 * @returns {this}
	 */
	select() {
		if (!this.isSelected) {
			this.isSelected = true;
			this._syncRenderBgColor();
		}
		return this;
	}

	/**
	 * @returns {this}
	 */
	unselect() {
		if (this.isSelected) {
			this.isSelected = false;
			this._syncRenderBgColor();
		}
		return this;
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
	 * @param {CardPanelButton} button
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
