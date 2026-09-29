import {
	Render2DNode,
	RectangleDef,
	Color,
	TextTexture,
} from "../../../../../javascript_libs/canvas_engine/src/canvas_engine.js";
import { defaultGameConfig } from "../../../assets/game_config.js";
import { CardStateTypeEnum } from "./card_contants.js";
import { CardPipe } from "./card_pipe/card_pipe.js";

export class Card extends Render2DNode {
	constructor() {
		super();

		this.cardUiConfig = defaultGameConfig.uiConfig.card;

		this.templateId = -1;
		/** @type {Color} 背景色 */
		this.bgColor = new Color();
		this.width = -1;
		this.height = -1;
		this.geometry = new RectangleDef(0, 0, this.width, this.height);
		/** @type {TextTexture} 文字纹理 */
		this.titleTexture = new TextTexture("Card");
		/** @type {CardStoryGameType.CardStateTypeEnum} 卡牌状态 */
		this.state = CardStateTypeEnum.Grid;
		/** @type {number} 网格 X 坐标 */
		this.gridX = 0;
		/** @type {number} 网格 Y 坐标 */
		this.gridY = 0;
		/** @type {number} 网格位置唯一键 */
		this.gridPositionKey = -1;
		/** @type {CardStoryGameType.CardPanelSlot | null} */
		this.bindedPanelSlot = null;

		/** @type {number} 缓存宽（用于 buffer 更新检测） */
		this.cacheBufferWidth = -1;
		/** @type {number} 缓存高（用于 buffer 更新检测） */
		this.cacheBufferHeight = -1;

		this.dragUpdatePosition = true;
		this.centerSelf();

		this.initialized = false;
	}
	get pipe() {
		return CardPipe;
	}

	get title() {
		return this.titleTexture.text;
	}

	/**
	 * @param {CardStoryGameType.CardTemplate | null} template
	 * @param {CardStoryGameType.UIConfig['card']} cardUiConfig
	 */
	initialize(template, cardUiConfig) {
		if (!this.initialized) {
			this.initialized = true;
			this.updateConfig(cardUiConfig, false);
		}
		if (template) {
			this.templateId = template.id;
			this.titleTexture.updateTextAndStyle(template.name, cardUiConfig.titleTextureOption);
		} else {
			console.error("模板不存在");
		}

		return this;
	}
	/**
	 * @param {CardStoryGameType.CardTemplate | null} template
	 */
	setTemplate(template) {
		if (template) {
			this.templateId = template.id;
			this.titleTexture.text = template.name;
		} else {
			console.error("模板不存在");
		}
	}
	/**
	 * @param {CardStoryGameType.UIConfig['card']} cardUiConfig 卡牌 UI 配置
	 * @param {boolean} needUpdateTitleTexture 是否需要更新标题纹理
	 */
	updateConfig(cardUiConfig, needUpdateTitleTexture = true) {
		this.cardUiConfig = cardUiConfig;
		// 从配置创建颜色对象
		this.bgColor.setValue(
			this.cardUiConfig.bgColor.r,
			this.cardUiConfig.bgColor.g,
			this.cardUiConfig.bgColor.b,
			this.cardUiConfig.bgColor.a,
		);
		this.width = this.cardUiConfig.width;
		this.height = this.cardUiConfig.height;
		this.geometry.updateShape(0, 0, this.width, this.height);

		if (needUpdateTitleTexture) {
			this.titleTexture.updateStyle(this.cardUiConfig.titleTextureOption);
		}

		return this;
	}

	isSlot() {
		return this.state === CardStateTypeEnum.Slot;
	}
	isGrid() {
		return this.state === CardStateTypeEnum.Grid;
	}
	isPanel() {
		return this.state === CardStateTypeEnum.Panel;
	}
	isDrag() {
		return this.state === CardStateTypeEnum.Drag;
	}

	/**
	 * @param {CardStoryGameType.CardPanelSlot} panelSlot
	 */
	toSlot(panelSlot) {
		this.state = CardStateTypeEnum.Slot;
		this.bindedPanelSlot = panelSlot;
		this.bindedPanelSlot.setCurrentCard(this);
		this.applyCameraTransform = false;
		panelSlot.clearCardDropTarget();

		this.updateXY(
			panelSlot.viewCenterX - this.width * (this.pivotX - 0.5),
			panelSlot.viewCenterY - this.height * (this.pivotY - 0.5),
		);
		this.changeZIndex(this.cardUiConfig.panelSlotZIndex);
	}
	toGrid() {
		this.state = CardStateTypeEnum.Grid;
		this.changeZIndex(this.cardUiConfig.gridZIndex);
	}
	toDrag() {
		this.state = CardStateTypeEnum.Drag;
		this.changeZIndex(this.cardUiConfig.dragZIndex);
	}

	bindPanel() {
		this.state = CardStateTypeEnum.Panel;
		this.disableDragUpdatePosition();
		this.changeZIndex(this.cardUiConfig.gridZIndex);
	}
	unbindPanel() {
		this.state = CardStateTypeEnum.Grid;
		this.enableDragUpdatePosition();
	}
	unbindPanelSlot() {
		if (this.bindedPanelSlot) {
			this.bindedPanelSlot.setCurrentCard(null);
			this.bindedPanelSlot = null;
		}
		this.applyCameraTransform = true;
	}

	/**
	 * 更新卡牌位置和网格坐标
	 * @param {Card['gridPositionKey']} gridPositionKey - 网格位置唯一键
	 * @param {number} worldX
	 * @param {number} worldY
	 * @param {number} gridX
	 * @param {number} gridY
	 * @returns {this}
	 */
	toGridPosition(gridPositionKey, worldX, worldY, gridX, gridY) {
		this.x = worldX;
		this.y = worldY;
		this.gridX = gridX;
		this.gridY = gridY;
		this.gridPositionKey = gridPositionKey;

		this.applyCameraTransform = true;

		return this;
	}

	/**
	 * @param {number} zIndex
	 */
	changeZIndex(zIndex) {
		this.zIndex = zIndex;
		if (this.parent) {
			this.parent.sortChildren();
		}
	}
	recoveryZIndex() {
		this.changeZIndex(this.cardUiConfig.gridZIndex);
	}

	/**
	 * 自定义 JSON 序列化，只导出必要字段，避免循环引用
	 * @returns {object} 可序列化的卡牌数据
	 */
	toJSON() {
		return {
			templateId: this.templateId,
			gridX: this.gridX,
			gridY: this.gridY,
		};
	}

	destroy() {
		this.titleTexture.destroy();
		this.bgColor.destroy();
		super.destroy();
	}
}
