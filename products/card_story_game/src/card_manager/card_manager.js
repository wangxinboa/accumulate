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
		/** @type {number} */
		this.cardZIndex = -1;

		this.onCardClick = this.onCardClick.bind(this);
		this.onCardDragStart = this.onCardDragStart.bind(this);
		this.onCardDrag = this.onCardDrag.bind(this);
		this.onCardDragEnd = this.onCardDragEnd.bind(this);
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
		card.changeZIndex(this.game.panel.zIndex + 1);
	}

	/**
	 * @param {Card} card
	 */
	onCardDrag(card) {
		// 1. 检测卡牌是否与面板重叠，并更新调试矩形
		const overlap = this.game.panel.checkOverlap(card);

		// 2. 如果与面板重叠，进一步检测与哪个卡槽重叠
		if (overlap) {
			// 获取重叠的最近卡槽（内部已处理高亮状态更新）
			this.game.panel.slotAreaUi.setOverlappingSlot(card);
		} else {
			// 卡牌不在面板上时，清除悬停高亮状态
			this.game.panel.slotAreaUi.setOverlappingSlot(null);
		}
	}

	/**
	 * @param {Card} card
	 */
	onCardDragEnd(card) {
		this.game.panel.slotAreaUi.setOverlappingSlot(null);

		const originalX = card.x;
		const originalY = card.y;
		const originalGridX = card.gridX;
		const originalGridY = card.gridY;

		const nearestGrid = this.positionManager._worldToGridNearest(card.x, card.y);
		const nearestGridKey = this.positionManager._getGridPositionKey(nearestGrid.x, nearestGrid.y);

		try {
			if (this.positionManager._isGridOccupied(nearestGridKey)) {
				const oldWorldPos = this.positionManager._gridToWorld(card.gridX, card.gridY);
				card.x = oldWorldPos.x;
				card.y = oldWorldPos.y;
			} else {
				const targetFreeGrid = this.positionManager._findNearestFreeGridBFS(nearestGrid.x, nearestGrid.y);
				const targetWorldPos = this.positionManager._gridToWorld(targetFreeGrid.x, targetFreeGrid.y);

				this.positionManager.updateCardPosition(
					card,
					targetWorldPos.x,
					targetWorldPos.y,
					targetFreeGrid.x,
					targetFreeGrid.y,
				);
			}
			card.changeZIndex(this.cardZIndex);
		} catch (e) {
			this.positionManager.updateCardPosition(card, originalX, originalY, originalGridX, originalGridY);
		}
	}

	/**
	 * 根据模板 ID 和存档数据创建卡牌
	 * @param {number} templateId - 模板 ID
	 * @param {Object} saveData - 存档数据，包含 text, gridX, gridY
	 * @param {string} [saveData.text] - 可选文本，若未提供则使用模板中的 name
	 * @param {number} saveData.gridX - 网格 X 坐标
	 * @param {number} saveData.gridY - 网格 Y 坐标
	 * @returns {Card}
	 */
	createCard(templateId, saveData) {
		const gridX = saveData.gridX || 0;
		const gridY = saveData.gridY || 0;
		const gridKey = this.positionManager._getGridPositionKey(gridX, gridY);

		if (this.positionManager._isGridOccupied(gridKey)) {
			throw new Error("Grid (" + gridX + ", " + gridY + ") is already occupied.");
		}

		const pos = this.positionManager._gridToWorld(gridX, gridY);

		// 创建卡牌实例，传入 game 和尺寸
		const newCard = new Card(templateId, this.game);

		newCard
			.addClickEvent(this.onCardClick)
			.addDragStartEvent(this.onCardDragStart)
			.addDragEvent(this.onCardDrag)
			.addDragEndEvent(this.onCardDragEnd);

		this.positionManager.updateCardPosition(newCard, pos.x, pos.y, gridX, gridY);
		this.game.addCard(newCard);

		return newCard;
	}

	destroy() {
		this.positionManager.destroy();

		super.destroy();
	}
}
