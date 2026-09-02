import { RenderNodePool } from "../../../../javascript_libs/canvas_engine/src/canvas_engine.js";
import { BaseCleanUp } from "../../../../javascript_libs/javascript_utils/javascript_utils.js";
import { Card } from "./card/card.js";
import { CardPosition } from "./card_position.js";

export class CardManager extends BaseCleanUp {
	/**
	 * @param {CardStoryGameType.CardStoryGame} cardStoryGame
	 */
	constructor(cardStoryGame) {
		super();
		/** @type {CardStoryGameType.CardStoryGame} */
		this.game = cardStoryGame;
		this.positionManager = new CardPosition();

		this.cardPool = new RenderNodePool(Card);
		/** @type {number} */
		this.cardZIndex = -1;

		this.onCardClick = this.onCardClick.bind(this);
		this.onCardDragStart = this.onCardDragStart.bind(this);
		this.onCardDrag = this.onCardDrag.bind(this);
		this.onCardDragEnd = this.onCardDragEnd.bind(this);

		this.cardIsInPanel = false;
	}

	/**
	 * 根据游戏配置初始化面板参数
	 * @param {CardStoryGameType.GameConfigData['uiConfig']['card']} cardUiConfig - 游戏配置数据（来自 game_config.json）
	 */
	initConfig(cardUiConfig) {
		this.positionManager.initConfig(cardUiConfig);

		this.cardZIndex = cardUiConfig.cardZIndex;
	}

	/**
	 * @param {Card} card
	 */
	onCardClick(card) {
		card.changeZIndex(this.cardZIndex);
		this.game.panel.show(card);
	}

	/**
	 * @param {Card} card
	 */
	onCardDragStart(card) {
		if (!this.game.panel.isMountedCard(card)) {
			card.changeZIndex(this.game.panel.zIndex + 1);
		}
	}

	/**
	 * @param {Card} card
	 */
	onCardDrag(card) {
		if (!this.game.panel.isMountedCard(card)) {
			// 1. 检测卡牌是否与面板重叠，并更新调试矩形
			this.cardIsInPanel = this.game.panel.checkOverlap(card);

			// 2. 如果与面板重叠，进一步检测与哪个卡槽重叠
			if (this.cardIsInPanel) {
				// 获取重叠的最近卡槽（内部已处理高亮状态更新）
				this.game.panel.slotAreaUi.setCardOverlappingSlot(card);
			} else {
				// 卡牌不在面板上时，清除悬停高亮状态
				this.game.panel.slotAreaUi.setCardOverlappingSlot(null);
			}
		}
	}

	/**
	 * @param {Card} card
	 */
	onCardDragEnd(card) {
		if (!this.game.panel.isMountedCard(card)) {
			const originalX = card.x;
			const originalY = card.y;
			const originalGridX = card.gridX;
			const originalGridY = card.gridY;

			const nearestGrid = this.positionManager._worldToGridNearest(card.x, card.y);
			const nearestGridKey = this.positionManager.getGridPositionKey(nearestGrid.x, nearestGrid.y);

			try {
				if (this.positionManager._isGridOccupied(nearestGridKey)) {
					const oldWorldPos = this.positionManager._gridToWorld(card.gridX, card.gridY);
					card.x = oldWorldPos.x;
					card.y = oldWorldPos.y;
				} else {
					const targetFreeGrid = this.positionManager._findNearestFreeGridBFS(nearestGrid.x, nearestGrid.y);
					const targetWorldPos = this.positionManager._gridToWorld(targetFreeGrid.x, targetFreeGrid.y);

					this.positionManager.updateCardGridPosition(
						card,
						targetWorldPos.x,
						targetWorldPos.y,
						targetFreeGrid.x,
						targetFreeGrid.y,
					);
				}
				card.changeZIndex(this.cardZIndex);
			} catch (e) {
				this.positionManager.updateCardGridPosition(card, originalX, originalY, originalGridX, originalGridY);
			}

			this.cardIsInPanel = false;
			this.game.panel.slotAreaUi.setCardOverlappingSlot(null);
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
		const gridKey = this.positionManager.getGridPositionKey(gridX, gridY);

		if (this.positionManager._isGridOccupied(gridKey)) {
			throw new Error("Grid (" + gridX + ", " + gridY + ") is already occupied.");
		}

		const pos = this.positionManager._gridToWorld(gridX, gridY);
		const cardTemplate = this.game.gameConfig.getCardTemplate(templateId);
		// 创建卡牌实例，传入 game 和尺寸
		const newCard = this.cardPool.acquire(this.game.engine.scene);
		this.positionManager.updateCardGridPosition(newCard, pos.x, pos.y, gridX, gridY);

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
		this.positionManager.clearCardPosition(card);
		this.cardPool.release(card);
	}

	destroy() {
		this.positionManager.destroy();

		super.destroy();
	}
}
