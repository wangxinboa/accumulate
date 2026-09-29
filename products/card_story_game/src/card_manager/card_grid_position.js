import { Vector2 } from "../../../../javascript_libs/canvas_engine/src/canvas_engine.js";
import { BaseCleanUp } from "../../../../javascript_libs/javascript_utils/javascript_utils.js";

const _gridPosition = new Vector2();
const _worldPosition = new Vector2();

export class CardGridPosition extends BaseCleanUp {
	constructor() {
		super();
		/** @type {Record<string, CardStoryGameType.Card>} */
		this.allCardGridPositionsMap = {};
		/** @type {number} 卡牌宽度（从配置读取） */
		this.cardWidth = -1;
		/** @type {number} 卡牌高度（从配置读取） */
		this.cardHeight = -1;
		/** @type {number} 网格偏移量（从配置读取） */
		this.coordOffset = -1;
		/** @type {number} BFS最大搜索深度（从配置读取） */
		this.maxSearchDepth = -1;
		/** @type {number} 网格水平间距（从配置读取） */
		this.gapX = -1;
		/** @type {number} 网格垂直间距（从配置读取） */
		this.gapY = -1;
		/** @type {number} 网格单元宽度 */
		this.cellWidth = -1;
		/** @type {number} 网格单元高度 */
		this.cellHeight = -1;
	}
	/**
	 * 根据游戏配置初始化面板参数
	 * @param {CardStoryGameType.GameConfigData['uiConfig']['card']} cardUiConfig - 游戏配置数据（来自 game_config.json）
	 */
	updateConfig(cardUiConfig) {
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
	gridToWorld(gridX, gridY) {
		return _worldPosition.set(this.cellWidth * gridX, this.cellHeight * gridY);
	}
	/**
	 * @param {number} worldX
	 * @param {number} worldY
	 */
	worldToGridNearest(worldX, worldY) {
		return _gridPosition.set(Math.round(worldX / this.cellWidth), Math.round(worldY / this.cellHeight));
	}
	/**
	 * @param {number} gridX
	 * @param {number} gridY
	 * @returns {CardStoryGameType.Card['gridPositionKey']}
	 */
	getGridPositionKey(gridX, gridY) {
		const a = gridX + this.coordOffset;
		const b = gridY + this.coordOffset;
		return a >= b ? a * a + a + b : a + b * b;
	}
	/**
	 * @param {number} gridPositionKey
	 */
	isGridPositionKeyOccupied(gridPositionKey) {
		return this.allCardGridPositionsMap[gridPositionKey];
	}
	/**
	 * @param {number} gridX
	 * @param {number} gridY
	 */
	isGridOccupied(gridX, gridY) {
		return this.allCardGridPositionsMap[this.getGridPositionKey(gridX, gridY)] !== undefined;
	}
	/**
	 * @param {number} startGridX
	 * @param {number} startGridY
	 */
	findNearestFreeGridBFS(startGridX, startGridY) {
		if (!this.isGridOccupied(startGridX, startGridY)) {
			return _gridPosition.set(startGridX, startGridY);
		}
		for (let d = 1; d <= this.maxSearchDepth; d++) {
			for (let dx = -d; dx <= d; dx++) {
				const x = startGridX + dx;
				const y = startGridY - d;
				if (!this.isGridOccupied(x, y)) {
					return _gridPosition.set(x, y);
				}
			}
			for (let dy = -d + 1; dy <= d; dy++) {
				const x = startGridX + d;
				const y = startGridY + dy;
				if (!this.isGridOccupied(x, y)) {
					return _gridPosition.set(x, y);
				}
			}
			for (let dx = d - 1; dx >= -d; dx--) {
				const x = startGridX + dx;
				const y = startGridY + d;
				if (!this.isGridOccupied(x, y)) {
					return _gridPosition.set(x, y);
				}
			}
			for (let dy = d - 1; dy >= -d + 1; dy--) {
				const x = startGridX - d;
				const y = startGridY + dy;
				if (!this.isGridOccupied(x, y)) {
					return _gridPosition.set(x, y);
				}
			}
		}
		throw new Error("超过最大搜索深度, 未找到下一个空闲网格");
	}

	/**
	 * @param {CardStoryGameType.Card} card
	 * @param {number} gridX
	 * @param {number} gridY
	 */
	toNearestGrid(card, gridX, gridY) {
		const targetFreeGrid = this.findNearestFreeGridBFS(gridX, gridY);
		this.updateCardPositionByGridXY(card, targetFreeGrid.x, targetFreeGrid.y);
	}
	/**
	 * @param {CardStoryGameType.Card} card
	 * @param {number} gridX
	 * @param {number} gridY
	 */
	updateCardPositionByGridXY(card, gridX, gridY) {
		const worldPos = this.gridToWorld(gridX, gridY);
		card.toGridPosition(this.getGridPositionKey(gridX, gridY), worldPos.x, worldPos.y, gridX, gridY);
		this.allCardGridPositionsMap[card.gridPositionKey] = card;
	}
	/**
	 * @param {CardStoryGameType.Card} card
	 */
	clearCardGridPosition(card) {
		if (this.allCardGridPositionsMap[card.gridPositionKey]) {
			delete this.allCardGridPositionsMap[card.gridPositionKey];
		}
	}
}
