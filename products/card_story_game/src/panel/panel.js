import {
	Render2DNode,
	Color,
	RectangleDef,
	TextTexture,
} from "../../../../javascript_libs/canvas_engine/src/canvas_engine.js";
import { PanelPipe } from "./panel_pipe/panel_pipe.js";

export class Panel extends Render2DNode {
	/**
	 * @param {CardStoryGameType.CardStoryGame} cardStoryGame
	 */
	constructor(cardStoryGame) {
		super();

		this.game = cardStoryGame;

		this.bgColor = new Color();
		this.textColor = new Color();
		this.width = 0;
		this.height = 0;
		this.titleHeight = 0;
		this.titleX = 0;
		this.titleY = 0;
		this.descRect = { x: 0, y: 0, width: 0, height: 0 };
		this.descFontSize = 0;
		this.titleTexture = null;
		this.descriptionTexture = null;

		this.geometry = new RectangleDef(0, 0, this.width, this.height);
		this.applyCameraTransform = false;
		this.visible = false;

		this.cacheBufferWidth = -1;
		this.cacheBufferHeight = -1;
		this.cacheTitleText = "";
		this.cacheDescText = "";

		this.hide = this.hide.bind(this);
		this.updateSizeAndPosition = this.updateSizeAndPosition.bind(this);
	}

	get pipe() {
		return PanelPipe;
	}

	/**
	 * 根据游戏配置初始化面板参数
	 * @param {CardStoryGameType.GameConfigData} configData - 游戏配置数据（来自 game_config.json）
	 */
	initConfig(configData) {
		const uiConfig = configData.uiConfig;
		if (!uiConfig) {
			return;
		}

		// 从配置创建颜色对象
		const bgColorObj = uiConfig.panelBgColor;
		this.bgColor.setValue(bgColorObj.r, bgColorObj.g, bgColorObj.b, bgColorObj.a);

		const textColorObj = uiConfig.panelTextColor;
		this.textColor.setValue(textColorObj.r, textColorObj.g, textColorObj.b, textColorObj.a);

		// 尺寸
		this.width = uiConfig.panelWidth;
		this.titleHeight = uiConfig.panelTitleHeight;
		this.titleX = uiConfig.panelTitleX;
		this.titleY = uiConfig.panelTitleY;

		// 描述区域
		const descRect = uiConfig.descriptionRect;
		if (descRect) {
			this.descRect.x = descRect.x ?? 8;
			this.descRect.y = descRect.y ?? 30;
			this.descRect.width = descRect.width ?? 284;
			this.descRect.height = descRect.height ?? 60;
		}
		this.descFontSize = uiConfig.descriptionFontSize ?? 12;

		// 纹理字体选项
		const titleFontSize = uiConfig.panelTitleFontSize ?? 16;
		const titleFontFamily = uiConfig.panelTitleFontFamily ?? "math";
		const descFontSize = uiConfig.panelDescFontSize ?? 12;
		const descFontFamily = uiConfig.panelDescFontFamily ?? "math";

		this.titleTexture = new TextTexture("Panel-Title", {
			fontSize: titleFontSize,
			fontFamily: titleFontFamily,
			fontWeight: "normal",
		});
		this.descriptionTexture = new TextTexture(
			"Panel-Description",
			{
				fontSize: descFontSize,
				fontFamily: descFontFamily,
				fontWeight: "normal",
			},
			this.descRect.width,
		);

		this.zIndex = uiConfig.panelZIndex ?? 1000;

		// 更新几何
		if (this.geometry) {
			this.geometry.max.x = this.width;
			this.geometry.max.y = this.height;
		}
	}

	/**
	 * 显示指定卡牌的详情
	 * @param {CardStoryGameType.Card} card
	 */
	show(card) {
		if (!this.titleTexture || !this.descriptionTexture) {
			return this;
		}
		this.titleTexture.text = card.text;
		const template = this.game.gameConfig.getCardTemplate(card.templateId);
		const desc = template ? template.description || "" : "";
		this.descriptionTexture.text = desc;
		this.visible = true;
		return this;
	}

	/**
	 * 隐藏面板（点击空白区域时触发）
	 * @param {CanvasEngineType.Scene2D} _scene2d
	 * @param {number} _x
	 * @param {number} _y
	 * @param {number} _sx
	 * @param {number} _sy
	 * @param {boolean} [hasMovedAfterDown]
	 */
	hide(_scene2d, _x, _y, _sx, _sy, hasMovedAfterDown) {
		if (!hasMovedAfterDown) {
			this.visible = false;
		}
		return this;
	}

	/**
	 * 根据画布尺寸更新面板大小和位置
	 * @param {number} canvasWidth
	 * @param {number} canvasHeight
	 */
	updateSizeAndPosition(canvasWidth, canvasHeight) {
		const uiConfig = this.game?.gameConfig?.uiConfig;
		if (!uiConfig) return;

		const ratio = uiConfig.panelHeightRatio ?? 0.8;
		this.height = canvasHeight * ratio;

		this.x = canvasWidth - this.width;
		const yOffset =
			canvasHeight > 400 ? (uiConfig.panelYOffset ?? 20) : canvasHeight * (uiConfig.panelYOffsetSmall ?? 0.05);
		this.y = yOffset;

		if (this.geometry) {
			this.geometry.max.x = this.width;
			this.geometry.max.y = this.height;
		}

		this.matrixNeedUpdate = true;
		this.worldMatrixNeedUpdate = true;
	}

	destroy() {
		if (this.titleTexture) {
			this.titleTexture.destroy();
		}
		if (this.descriptionTexture) {
			this.descriptionTexture.destroy();
		}
		this.bgColor.destroy();
		this.textColor.destroy();
		super.destroy();
	}
}
