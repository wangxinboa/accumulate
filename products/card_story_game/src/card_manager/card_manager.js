import { Vector2 } from "../../../../javascript_libs/canvas_engine/src/canvas_engine.js";
import { BaseCleanUp, CustomMap } from "../../../../javascript_libs/javascript_utils/javascript_utils.js";
import { defaultGameConfig } from "../../assets/game_config.js";
import { Card } from "./card/card.js";

const _gridPosition = new Vector2();
const _worldPosition = new Vector2();

export class CardManager extends BaseCleanUp {
	/** @type {CardStoryGameType.CardStoryGame} */
	game;
	/** @type {number} 卡牌宽度（从配置读取） */
	cardWidth;
	/** @type {number} 卡牌高度（从配置读取） */
	cardHeight;
	/** @type {number} 网格偏移量（从配置读取） */
	coordOffset;
	/** @type {number} BFS最大搜索深度（从配置读取） */
	maxSearchDepth;
	/** @type {number} 网格水平间距（从配置读取） */
	gapX;
	/** @type {number} 网格垂直间距（从配置读取） */
	gapY;
	/** @type {number} 网格单元宽度 */
	cellWidth;
	/** @type {number} 网格单元高度 */
	cellHeight;
	/** @type {number} */
	cardZIndex;

	/** @type {CustomMap<Card>} */
	allCardPositionsMap;

	/**
	 * @param {CardStoryGameType.CardStoryGame} cardStoryGame
	 */
	constructor(cardStoryGame) {
		super();
		this.game = cardStoryGame;
		this.allCardPositionsMap = new CustomMap();

		this.cardWidth = -1;
		this.cardHeight = -1;
		this.coordOffset = -1;
		this.maxSearchDepth = -1;
		this.gapX = -1;
		this.gapY = -1;
		this.cellWidth = -1;
		this.cellHeight = -1;
		this.cardZIndex = -1;

		this.onCardClick = this.onCardClick.bind(this);
		this.onCardDragStart = this.onCardDragStart.bind(this);
		this.onCardDrag = this.onCardDrag.bind(this);
		this.onCardDragEnd = this.onCardDragEnd.bind(this);
	}

	/**
	 * 根据游戏配置初始化面板参数
	 * @param {CardStoryGameType.GameConfigData} configData - 游戏配置数据（来自 game_config.json）
	 */
	initConfig(configData) {
		// 从配置读取参数
		const uiConfig = configData.uiConfig ?? defaultGameConfig.uiConfig;
		this.cardWidth = uiConfig.cardWidth;
		this.cardHeight = uiConfig.cardHeight;
		this.coordOffset = uiConfig.gridCoordOffset;
		this.maxSearchDepth = uiConfig.gridMaxSearchDepth;
		this.gapX = uiConfig.cardGapX;
		this.gapY = uiConfig.cardGapY;
		this.cellWidth = this.gapX * 2 + this.cardWidth;
		this.cellHeight = this.gapY * 2 + this.cardHeight;

		console.info("configData:", configData);

		this.cardZIndex = uiConfig.cardZIndex;
	}

	/**
	 * @param {number} gridX
	 * @param {number} gridY
	 */
	_gridToWorld(gridX, gridY) {
		return _worldPosition.set(this.cellWidth * gridX, this.cellHeight * gridY);
	}

	/**
	 * @param {number} worldX
	 * @param {number} worldY
	 */
	_worldToGridNearest(worldX, worldY) {
		return _gridPosition.set(Math.round(worldX / this.cellWidth), Math.round(worldY / this.cellHeight));
	}

	/**
	 * @param {string | number} gridKey
	 */
	_isGridOccupied(gridKey) {
		return this.allCardPositionsMap.has(gridKey);
	}

	/**
	 * @param {number} startX
	 * @param {number} startY
	 */
	_findNearestFreeGridBFS(startX, startY) {
		const startKey = this._getGridPositionKey(startX, startY);
		if (!this._isGridOccupied(startKey)) {
			return _gridPosition.set(startX, startY);
		}
		for (let d = 1; d <= this.maxSearchDepth; d++) {
			for (let dx = -d; dx <= d; dx++) {
				const x = startX + dx;
				const y = startY - d;
				const key = this._getGridPositionKey(x, y);
				if (!this._isGridOccupied(key)) {
					return _gridPosition.set(x, y);
				}
			}
			for (let dy = -d + 1; dy <= d; dy++) {
				const x = startX + d;
				const y = startY + dy;
				const key = this._getGridPositionKey(x, y);
				if (!this._isGridOccupied(key)) {
					return _gridPosition.set(x, y);
				}
			}
			for (let dx = d - 1; dx >= -d; dx--) {
				const x = startX + dx;
				const y = startY + d;
				const key = this._getGridPositionKey(x, y);
				if (!this._isGridOccupied(key)) {
					return _gridPosition.set(x, y);
				}
			}
			for (let dy = d - 1; dy >= -d + 1; dy--) {
				const x = startX - d;
				const y = startY + dy;
				const key = this._getGridPositionKey(x, y);
				if (!this._isGridOccupied(key)) {
					return _gridPosition.set(x, y);
				}
			}
		}
		throw new Error("超过最大搜索深度, 未找到下一个空闲网格");
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 * @returns {string|number}
	 */
	_getGridPositionKey(x, y) {
		const a = x + this.coordOffset;
		const b = y + this.coordOffset;
		return a >= b ? a * a + a + b : a + b * b;
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

	onCardDrag() {}

	/**
	 * @param {Card} card
	 */
	onCardDragEnd(card) {
		const nearestGrid = this._worldToGridNearest(card.x, card.y);
		const nearestGridKey = this._getGridPositionKey(nearestGrid.x, nearestGrid.y);

		if (this._isGridOccupied(nearestGridKey)) {
			const oldWorldPos = this._gridToWorld(card.gridX, card.gridY);
			card.x = oldWorldPos.x;
			card.y = oldWorldPos.y;
		} else {
			this.allCardPositionsMap.delete(card.gridPositionKey);
			const targetFreeGrid = this._findNearestFreeGridBFS(nearestGrid.x, nearestGrid.y);
			const targetWorldPos = this._gridToWorld(targetFreeGrid.x, targetFreeGrid.y);
			card.updatePosition(targetWorldPos.x, targetWorldPos.y, targetFreeGrid.x, targetFreeGrid.y);
			this.allCardPositionsMap.set(card.gridPositionKey, card);
		}

		card.changeZIndex(this.cardZIndex);
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
		const gridKey = this._getGridPositionKey(gridX, gridY);

		if (this._isGridOccupied(gridKey)) {
			throw new Error("Grid (" + gridX + ", " + gridY + ") is already occupied.");
		}

		const pos = this._gridToWorld(gridX, gridY);

		// 创建卡牌实例，传入 game 和尺寸
		const newCard = new Card(templateId, this.game);

		newCard
			.addClickEvent(this.onCardClick)
			.addDragStartEvent(this.onCardDragStart)
			.addDragEvent(this.onCardDrag)
			.addDragEndEvent(this.onCardDragEnd)
			.updatePosition(pos.x, pos.y, gridX, gridY);

		this.allCardPositionsMap.set(gridKey, newCard);
		this.game.addCard(newCard);
		return newCard;
	}

	/**
	 * 清空所有卡牌
	 */
	clearAllCards() {
		const cardArray = this.allCardPositionsMap.array.slice();
		for (let i = 0, len = cardArray.length; i < len; i++) {
			const card = cardArray[i];
			this.game.removeCard(card);
			card.destroy();
		}
		this.allCardPositionsMap.clear();
	}

	destroy() {
		this.clearAllCards();
		this.allCardPositionsMap.destroy();
		super.destroy();
	}
}
