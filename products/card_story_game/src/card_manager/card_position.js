import { Vector2 } from "../../../../javascript_libs/canvas_engine/src/canvas_engine.js";
import { BaseCleanUp } from "../../../../javascript_libs/javascript_utils/javascript_utils.js";

const _gridPosition = new Vector2();
const _worldPosition = new Vector2();

export class CardPosition extends BaseCleanUp {
	/** @type {Record<number, boolean>} */
	allCardPositionsMap;
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

	constructor() {
		super();

		this.allCardPositionsMap = {};

		this.cardWidth = -1;
		this.cardHeight = -1;
		this.coordOffset = -1;
		this.maxSearchDepth = -1;
		this.gapX = -1;
		this.gapY = -1;
		this.cellWidth = -1;
		this.cellHeight = -1;
	}
	/**
	 * 根据游戏配置初始化面板参数
	 * @param {CardStoryGameType.GameConfigData['uiConfig']['card']} cardUiConfig - 游戏配置数据（来自 game_config.json）
	 */
	initConfig(cardUiConfig) {
		this.cardWidth = cardUiConfig.width;
		this.cardHeight = cardUiConfig.height;
		this.coordOffset = cardUiConfig.gridCoordOffset;
		this.maxSearchDepth = cardUiConfig.gridMaxSearchDepth;
		this.gapX = cardUiConfig.gapX;
		this.gapY = cardUiConfig.gapY;
		this.cellWidth = this.gapX * 2 + this.cardWidth;
		this.cellHeight = this.gapY * 2 + this.cardHeight;
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
	 * @param {number} gridX
	 * @param {number} gridY
	 * @returns {number}
	 */
	_getGridPositionKey(gridX, gridY) {
		const a = gridX + this.coordOffset;
		const b = gridY + this.coordOffset;
		return a >= b ? a * a + a + b : a + b * b;
	}

	/**
	 * @param {number} gridKey
	 */
	_isGridOccupied(gridKey) {
		return this.allCardPositionsMap[gridKey];
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
	 * @param {CardStoryGameType.Card} card
	 * @param {number} worldX
	 * @param {number} worldY
	 * @param {number} gridX
	 * @param {number} gridY
	 */
	updateCardPosition(card, worldX, worldY, gridX, gridY) {
		delete this.allCardPositionsMap[card.gridPositionKey];

		const a = gridX + this.coordOffset;
		const b = gridY + this.coordOffset;
		this.gridPositionKey = a >= b ? a * a + a + b : a + b * b;

		card.updatePosition(a >= b ? a * a + a + b : a + b * b, worldX, worldY, gridX, gridY);
		this.allCardPositionsMap[card.gridPositionKey] = true;
	}
}
