import {
	Render2DNode,
	RectangleDef,
	Color,
	TextTexture,
} from "../../../../javascript_libs/canvas_engine/src/canvas_engine.js";
import { CardPanelPipe } from "./card_panel_pipe/card_panel_pipe.js";
import { CardPanelDescUi } from "./card_panel_ui/card_panel_desc_ui.js";
import { CardPanelButtonAreaUi } from "./card_panel_ui/card_panel_button_area_ui.js";

export class CardPanel extends Render2DNode {
	/**
	 * @param {CardStoryGameType.CardStoryGame} cardStoryGame
	 */
	constructor(cardStoryGame) {
		super();

		this.mountedCard = null;
		this.game = cardStoryGame;

		this.bgColor = new Color();

		this.titleTexture = new TextTexture("CardPanel-Title");

		this.descUi = new CardPanelDescUi();
		this.buttonAreaUi = new CardPanelButtonAreaUi(cardStoryGame);

		this.geometry = new RectangleDef(0, 0, this.width, this.height);
		this.applyCameraTransform = false;
		this.visible = false;

		this.cacheBufferWidth = -1;
		this.cacheBufferHeight = -1;
		this.cacheTitleText = "";
		this.cacheDescText = "";

		this.hide = this.hide.bind(this);
		this.updateSizeAndPosition = this.updateSizeAndPosition.bind(this);
		this.onWheel = this.onWheel.bind(this);

		// 注册滚轮事件
		this.addWheelEvent(this.onWheel);

		this._onButtonClick = this._onButtonClick.bind(this);
		this.add(this.buttonAreaUi);
	}

	get pipe() {
		return CardPanelPipe;
	}

	/**
	 * 根据游戏配置初始化面板参数
	 * @param {CardStoryGameType.GameConfigData['uiConfig']['panel']} panelUiConfig - 游戏配置数据（来自 game_config.json）
	 */
	updateConfig(panelUiConfig) {
		const bgColorObj = panelUiConfig.panelBgColor;
		this.bgColor.setValue(bgColorObj.r, bgColorObj.g, bgColorObj.b, bgColorObj.a);
		this.width = panelUiConfig.panelWidth;
		this.zIndex = panelUiConfig.panelZIndex ?? 1000;

		this.titleTexture.udpateStyle(panelUiConfig.panelTitle.textureOption);

		this.descUi.updateConfig(panelUiConfig.panelDesc);
		this.buttonAreaUi.updateConfig(panelUiConfig.panelButtonArea);

		if (this.geometry) {
			this.geometry.max.x = this.width;
			this.geometry.max.y = this.height;
		}
	}

	get descriptionTexture() {
		return this.descUi.descriptionTexture;
	}

	/**
	 * 显示指定卡牌的详情
	 * @param {CardStoryGameType.Card} card
	 */
	show(card) {
		if (!this.titleTexture || !this.descriptionTexture) {
			return this;
		}

		this.mountedCard = card;
		this.titleTexture.text = card.text;

		const template = this.game.gameConfig.getCardTemplate(card.templateId);
		const desc = template ? template.description || "" : "";
		this.descUi.updateDescription(desc);

		this.buttonAreaUi.topY = this.descUi.bottomY;
		const actions = template ? template.actions || [] : [];
		this.buttonAreaUi.updateButtons(actions, this._onButtonClick);

		this.visible = true;
		return this;
	}

	/**
	 * 按钮点击处理
	 * @param {CardStoryGameType.Button} button
	 */
	_onButtonClick(button) {
		const action = this.game.gameConfig.getCardAction(button.actionId);
		console.info(action);
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
			this.mountedCard = null;
		}
		return this;
	}

	/**
	 * 根据画布尺寸更新面板大小和位置
	 * @param {number} canvasWidth
	 * @param {number} canvasHeight
	 */
	updateSizeAndPosition(canvasWidth, canvasHeight) {
		const panelUiConfig = this.game?.gameConfig.uiConfig.panel;
		if (!panelUiConfig) return;

		const ratio = panelUiConfig.panelHeightRatio ?? 0.8;
		this.height = canvasHeight * ratio;

		// 面板贴在右侧边缘：X = 右边缘 - 面板宽度
		this.x = canvasWidth / 2 - this.width;

		// 从顶部向下偏移：顶部是 -canvasHeight/2，向下为 Y 负方向
		const yOffset =
			canvasHeight > 400
				? (panelUiConfig.panelYOffset ?? 20)
				: canvasHeight * (panelUiConfig.panelYOffsetSmall ?? 0.05);
		this.y = canvasHeight / 2 - this.height - yOffset;

		if (this.geometry) {
			this.geometry.max.x = this.width;
			this.geometry.max.y = this.height;
		}

		this.matrixNeedUpdate = true;
		this.worldMatrixNeedUpdate = true;
	}

	/**
	 * 滚轮事件处理函数
	 * @param {CanvasEngineType.RenderEventNode} _node
	 * @param {number} _dx
	 * @param {number} dy
	 * @param {number} _dz
	 * @param {number} _x - 相机空间坐标（已应用相机变换）
	 * @param {number} _y - 相机空间坐标（已应用相机变换）
	 * @param {number} sx - 世界坐标 X（由于面板 applyCameraTransform=false，此处等于屏幕坐标）
	 * @param {number} sy - 世界坐标 Y（由于面板 applyCameraTransform=false，此处等于屏幕坐标）
	 */
	onWheel(_node, _dx, dy, _dz, _x, _y, sx, sy) {
		// 面板不可见时忽略
		if (!this.visible) {
			return;
		}

		const sxInPanel = sx - this.x;
		const syInPanel = this.height - sy + this.y;

		const isInPanelDescRect = this.descUi.hitScreenPoint(sxInPanel, syInPanel);

		if (isInPanelDescRect) {
			this.descUi.scroll(dy);
		}
	}

	destroy() {
		this.bgColor.destroy();
		this.titleTexture.destroy();
		this.buttonAreaUi.destroy();
		this.descUi.destroy();

		super.destroy();
	}
}
