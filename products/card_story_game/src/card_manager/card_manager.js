import { Render2DNode, Vector2 } from "../../../../javascript_libs/canvas_engine/src/canvas_engine.js";
import { CustomMap } from "../../../../javascript_libs/javascript_utils/javascript_utils.js";
import { Card } from "./card/card.js";

const _gridPosition = new Vector2();
const _worldPosition = new Vector2();

export class CardManager extends Render2DNode {
	static cardWidth = 60;
	static cardHeight = 90;
	/** @type {CardStoryGameType.CardStoryGame} */
	game;
	static coordOffset = 10000;
	static maxSearchDepth = 100;

	/**
	 * @param {number} x
	 * @param {number} y
	 */
	static getGridPositionKey(x, y) {
		const a = x + CardManager.coordOffset;
		const b = y + CardManager.coordOffset;
		return a >= b ? a * a + a + b : a + b * b;
	}

	/** @type {CustomMap<Card>} */
	allCardPositionsMap;
	gapX;
	gapY;
	cellWidth;
	cellHeight;

	/**
	 * @param {CardStoryGameType.CardStoryGame} cardStoryGame
	 */
	constructor(cardStoryGame) {
		super();
		this.game = cardStoryGame;
		this.allCardPositionsMap = new CustomMap();

		this.onCardMouseDown = this.onCardMouseDown.bind(this);
		this.onCardDragStart = this.onCardDragStart.bind(this);
		this.onCardDrag = this.onCardDrag.bind(this);
		this.onCardDragEnd = this.onCardDragEnd.bind(this);

		this.gapX = 4;
		this.gapY = 4;
		this.cellWidth = this.gapX * 2 + CardManager.cardWidth;
		this.cellHeight = this.gapY * 2 + CardManager.cardHeight;
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
		const startKey = CardManager.getGridPositionKey(startX, startY);
		if (!this._isGridOccupied(startKey)) {
			return _gridPosition.set(startX, startY);
		}
		for (let d = 1; d <= CardManager.maxSearchDepth; d++) {
			for (let dx = -d; dx <= d; dx++) {
				const x = startX + dx;
				const y = startY - d;
				const key = CardManager.getGridPositionKey(x, y);
				if (!this._isGridOccupied(key)) {
					return _gridPosition.set(x, y);
				}
			}
			for (let dy = -d + 1; dy <= d; dy++) {
				const x = startX + d;
				const y = startY + dy;
				const key = CardManager.getGridPositionKey(x, y);
				if (!this._isGridOccupied(key)) {
					return _gridPosition.set(x, y);
				}
			}
			for (let dx = d - 1; dx >= -d; dx--) {
				const x = startX + dx;
				const y = startY + d;
				const key = CardManager.getGridPositionKey(x, y);
				if (!this._isGridOccupied(key)) {
					return _gridPosition.set(x, y);
				}
			}
			for (let dy = d - 1; dy >= -d + 1; dy--) {
				const x = startX - d;
				const y = startY + dy;
				const key = CardManager.getGridPositionKey(x, y);
				if (!this._isGridOccupied(key)) {
					return _gridPosition.set(x, y);
				}
			}
		}
		throw new Error("超过最大搜索深度, 未找到下一个空闲网格");
	}

	/**
	 * @param {Card} card
	 */
	onCardMouseDown(card) {
		this.game.panel.show(card);
	}

	/**
	 * @param {Card} card
	 */
	onCardDragStart(card) {
		card.zIndex = 1;
		if (card.parent) {
			card.parent.sortChildren();
		}
	}

	onCardDrag() {}

	/**
	 * @param {Card} card
	 */
	onCardDragEnd(card) {
		const nearestGrid = this._worldToGridNearest(card.x, card.y);
		const nearestGridKey = CardManager.getGridPositionKey(nearestGrid.x, nearestGrid.y);

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
		card.zIndex = 0;
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
		const gridKey = CardManager.getGridPositionKey(gridX, gridY);

		if (this._isGridOccupied(gridKey)) {
			throw new Error("Grid (" + gridX + ", " + gridY + ") is already occupied.");
		}

		const pos = this._gridToWorld(gridX, gridY);

		// 创建卡牌实例，只传 templateId 和 game
		const newCard = new Card(templateId, this.game);

		newCard
			.addDragStartEvent(this.onCardDragStart)
			.addDragEvent(this.onCardDrag)
			.addDragEndEvent(this.onCardDragEnd)
			.updatePosition(pos.x, pos.y, gridX, gridY);

		newCard.addMouseDownEvent(this.onCardMouseDown);

		this.allCardPositionsMap.set(gridKey, newCard);
		this.add(newCard);
		return newCard;
	}

	/**
	 * 清空所有卡牌
	 */
	clearAllCards() {
		const cardArray = this.allCardPositionsMap.array.slice();
		for (let i = 0, len = cardArray.length; i < len; i++) {
			const card = cardArray[i];
			this.remove(card);
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
