import { RenderNodePool } from "../../../../javascript_libs/canvas_engine/src/canvas_engine.js";
import { BaseCleanUp } from "../../../../javascript_libs/javascript_utils/javascript_utils.js";
import { Card } from "./card/card.js";
import { CardGridPosition } from "./card_grid_position.js";

export class CardManager extends BaseCleanUp {
	/**
	 * @param {CardStoryGameType.CardStoryGame} cardStoryGame
	 */
	constructor(cardStoryGame) {
		super();
		/** @type {CardStoryGameType.CardStoryGame} */
		this.game = cardStoryGame;
		this.gridPosition = new CardGridPosition();

		this.cardPool = new RenderNodePool(Card);

		this.onCardClick = this.onCardClick.bind(this);
		this.onCardDragStart = this.onCardDragStart.bind(this);
		this.onCardDrag = this.onCardDrag.bind(this);
		this.onCardDragEnd = this.onCardDragEnd.bind(this);

		this.cardToDragCount = 0;

		this.cardIsInPanel = false;
	}

	/**
	 * 根据游戏配置初始化面板参数
	 * @param {CardStoryGameType.GameConfigData['uiConfig']['card']} cardUiConfig - 游戏配置数据（来自 game_config.json）
	 */
	initConfig(cardUiConfig) {
		this.gridPosition.updateConfig(cardUiConfig);
	}

	/**
	 * 从网格中开始拖拽
	 * @param {Card} card
	 */
	updateCardFromGridToDrag(card) {
		card.toDrag();
		this.gridPosition.clearCardGridPosition(card);
	}
	/**
	 * 从面板卡槽中开始拖拽
	 * @param {Card} card
	 */
	updateCardFromPanelSlotToDrag(card) {
		card.toDrag();
		card.unbindPanelSlot();
		this.game.panel.slotAreaUi.updateDropTargetSlot(card.bindedPanelSlot);
	}
	/**
	 * 从面板卡槽中回到网格
	 * @param {Card} card
	 */
	updateCardFromPanelSlotToGrid(card) {
		card.toGrid();
		card.unbindPanelSlot();
		this.gridPosition.toNearestGrid(card, card.gridX, card.gridY);
	}
	/**
	 * 从拖拽状态回到网格中
	 * @param {Card} card
	 */
	updateCardFromDragToGrid(card) {
		card.toGrid();
	}
	/**
	 * 从拖拽状态到面板卡槽中
	 * @param {Card} card
	 * @param {CardStoryGameType.CardPanelSlot} panelSlot
	 */
	updateCardFromDragToPanelSlot(card, panelSlot) {
		card.toSlot(panelSlot);
	}

	/**
	 * @param {Card} card
	 */
	onCardClick(card) {
		if (card.isDrag()) {
			this.game.panel.show(card);
			this.gridPosition.updateCardPositionByGridXY(card, card.gridX, card.gridY);
		}
	}
	/**
	 * @param {Card} card
	 */
	onCardDragStart(card) {
		if (card.isGrid()) {
			this.updateCardFromGridToDrag(card);
		} else if (card.isSlot()) {
			this.updateCardFromPanelSlotToDrag(card);
		}
		this.cardIsInPanel = false;
	}
	/**
	 * @param {Card} card
	 */
	onCardDrag(card) {
		if (card.isDrag() && this.game.panel.visible) {
			// 1. 检测卡牌是否与面板重叠
			this.cardIsInPanel = this.game.panel.checkOverlap(card);

			// 2. 如果与面板重叠，进一步检测与哪个卡槽重叠
			if (this.cardIsInPanel) {
				// 获取重叠的最近卡槽（内部已处理高亮状态更新）
				this.game.panel.slotAreaUi.checkCardOverlappingSlot(card);
			} else {
				// 卡牌不在面板上时，清除悬停高亮状态
				this.game.panel.slotAreaUi.checkCardOverlappingSlot(null);
			}
		}
	}
	/**
	 * @param {Card} card
	 */
	onCardDragEnd(card) {
		if (card.isDrag()) {
			const dropTargetSlot = this.game.panel.slotAreaUi.dropTargetSlot;
			if (dropTargetSlot) {
				// 放置到卡槽位置中
				this.updateCardFromDragToPanelSlot(card, dropTargetSlot);
			} else if (this.cardIsInPanel) {
				// 与面板重叠, 返回原来的位置
				this.gridPosition.toNearestGrid(card, card.gridX, card.gridY);
				this.updateCardFromDragToGrid(card);
			} else {
				const nearestGrid = this.gridPosition.worldToGridNearest(card.x, card.y);

				if (this.gridPosition.isGridOccupied(nearestGrid.x, nearestGrid.y)) {
					this.gridPosition.toNearestGrid(card, card.gridX, card.gridY);
				} else {
					this.gridPosition.updateCardPositionByGridXY(card, nearestGrid.x, nearestGrid.y);
				}
				this.updateCardFromDragToGrid(card);
			}
		}
	}
	/**
	 * 根据模板 ID 和存档数据创建卡牌
	 * @param {number} templateId - 模板 ID
	 * @param {number} gridX - 网格 X 坐标
	 * @param {number} gridY - 网格 Y 坐标
	 * @returns {Card}
	 */
	createCardToGrid(templateId, gridX, gridY) {
		if (this.gridPosition.isGridOccupied(gridX, gridY)) {
			throw new Error("Grid (" + gridX + ", " + gridY + ") is already occupied.");
		}

		const cardTemplate = this.game.gameConfig.getCardTemplate(templateId);
		// 创建卡牌实例，传入 game 和尺寸
		const newCard = this.cardPool.acquire(this.game.engine.scene);
		this.gridPosition.updateCardPositionByGridXY(newCard, gridX, gridY);

		if (newCard.initialized) {
			newCard.setTemplate(cardTemplate);
		} else {
			newCard
				.initialize(cardTemplate, this.game.gameConfig.uiConfig.card)
				.addClickEvent(this.onCardClick)
				.addDragStartEvent(this.onCardDragStart)
				.addDragEvent(this.onCardDrag)
				.addDragEndEvent(this.onCardDragEnd);
		}

		return newCard;
	}
	/**
	 * @param {Card} card
	 */
	removeCardFromGrid(card) {
		this.gridPosition.clearCardGridPosition(card);
		this.cardPool.release(card);
	}

	destroy() {
		this.gridPosition.destroy();

		super.destroy();
	}
}
