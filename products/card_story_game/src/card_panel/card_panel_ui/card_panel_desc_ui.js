import { Matrix3, TextTexture } from "../../../../../javascript_libs/canvas_engine/src/canvas_engine.js";
import { BaseCleanUp } from "../../../../../javascript_libs/javascript_utils/javascript_utils.js";
import { defaultGameConfig } from "../../../assets/game_config.js";

export class CardPanelDescUi extends BaseCleanUp {
	constructor() {
		super();

		/** @type {number} 描述文字的实际高度（像素） */
		this.actualDescHeight = 0;
		/** @type {number} 描述文字底部的 y 位置 */
		this.bottomY = 0;
		/** @private @type {boolean} 是否允许滚动 */
		this._needScroll = false;
		/** @type {number} 当前滚动的偏移量（像素），范围 0 ~ (actualDescHeight - fixedHeight) */
		this.scrollOffset = 0;
		/** @type {Matrix3} UV 变换矩阵，用于滚动 */
		this.descUvTransformMatrix = new Matrix3();

		this.descriptionTexture = this.descriptionTexture = new TextTexture("CardPanel-Description");

		this.panelDescUiConfig = defaultGameConfig.uiConfig.panel.panelDesc;
	}

	/**
	 * @param {CardStoryGameType.GameConfigData['uiConfig']['panel']['panelDesc']} panelDescUiConfig - 面板配置数据（来自 game_config.json）
	 */
	updateConfig(panelDescUiConfig) {
		this.panelDescUiConfig = panelDescUiConfig;
		this.descriptionTexture.updateStyle(this.panelDescUiConfig.textureOption);
	}

	/**
	 * @param {string} descText
	 */
	updateDescription(descText) {
		if (this.descriptionTexture) {
			this.descriptionTexture.text = descText;

			if (this.descriptionTexture.height > this.panelDescUiConfig.height) {
				this._needScroll = true;
				this.actualDescHeight = this.panelDescUiConfig.height;
			} else {
				this._needScroll = false;
				this.actualDescHeight = this.descriptionTexture.height;
			}

			this.bottomY = this.panelDescUiConfig.y + this.actualDescHeight;
			this.scrollOffset = 0;

			// 更新 UV 变换矩阵
			this.updateScrollMatrix();
		}
	}

	/**
	 * @param {number} deltaY
	 */
	scroll(deltaY) {
		if (!this._needScroll || !this.descriptionTexture) {
			return;
		}
		// 计算滚动增量
		if (this.panelDescUiConfig.scrollInvert) {
			deltaY = -deltaY;
		}
		// 更新滚动偏移，并限制范围
		const maxOffset = this.descriptionTexture.height - this.actualDescHeight;
		this.scrollOffset = Math.max(0, Math.min(maxOffset, this.scrollOffset + deltaY));
		// 更新矩阵
		this.updateScrollMatrix();
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 */
	hitScreenPoint(x, y) {
		return (
			x >= this.panelDescUiConfig.x &&
			x <= this.panelDescUiConfig.x + this.panelDescUiConfig.width &&
			y >= this.panelDescUiConfig.y &&
			y <= this.panelDescUiConfig.y + this.panelDescUiConfig.height
		);
	}

	/**
	 * 更新 UV 变换矩阵，根据 scrollOffset 和 actualDescHeight 计算
	 */
	updateScrollMatrix() {
		if (!this._needScroll) {
			this.descUvTransformMatrix.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
			return;
		}
		// 计算缩放和平移
		const scale = this.panelDescUiConfig.height / this.descriptionTexture.height;
		const offset = this.scrollOffset / this.descriptionTexture.height;

		// 构建变换矩阵：将 UV 从 [0,1] 映射到 [offset, offset+scale]
		// 行主序： [1, 0, 0]
		//         [0, scale, offset]
		//         [0, 0, 1]
		this.descUvTransformMatrix.set(1, 0, 0, 0, scale, offset, 0, 0, 1);
	}

	destroy() {
		if (this.descriptionTexture) {
			this.descriptionTexture.destroy();
		}
		super.destroy();
	}
}
