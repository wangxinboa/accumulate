import { BaseCleanUp } from "../../../../javascript_libs/javascript_utils/javascript_utils.js";

export class GameDataExporter extends BaseCleanUp {
	/**
	 * @param {CardStoryGameType.CardStoryGame} game
	 */
	constructor(game) {
		super();

		this.game = game;
	}

	/**
	 * 导出游戏数据为 JSON 字符串
	 * @returns {string} JSON 字符串
	 */
	export() {
		return JSON.stringify(
			{
				saveData: {
					cards: Object.values(this.game.cardManager.positionManager.allCardGridPositionsMap),
				},
			},
			null,
			4,
		);
	}
}
