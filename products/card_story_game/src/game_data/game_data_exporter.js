export class GameDataExporter {
	/**
	 * 导出游戏数据为 JSON 字符串
	 * @param {CardStoryGameType.CardStoryGame} game
	 * @returns {string} JSON 字符串
	 */
	static export(game) {
		return JSON.stringify(
			{
				saveData: {
					cards: game.cardManager.allCardPositionsMap.array,
				},
			},
			null,
			4,
		);
	}
}
