import { LoaderManager } from "../../../../javascript_libs/canvas_engine/src/loader/loader_manager.js";
import { BaseCleanUp } from "../../../../javascript_libs/javascript_utils/javascript_utils.js";

export class GameDataLoader extends BaseCleanUp {
	/**
	 * @param {CardStoryGameType.CardStoryGame} game
	 */
	constructor(game) {
		super();

		this.game = game;

		this.afterLoadedCallback = this.afterLoadedCallback.bind(this);
	}

	load() {
		LoaderManager.addJsonTask("../assets/game_data.json").addLoadedCallback(this.afterLoadedCallback);
	}

	/**
	 * @param {JavaScriptUtilsType.JsonTask<CardStoryGameType.GameData>} task
	 */
	afterLoadedCallback(task) {
		if (task.data && task.data.saveData) {
			try {
				const cardManager = this.game.cardManager;
				const cardsData = task.data.saveData.cards || [];
				for (let i = 0, len = cardsData.length; i < len; i++) {
					const cardInfo = cardsData[i];
					const text = cardInfo.text || "Card";
					const gridX = cardInfo.gridX || 0;
					const gridY = cardInfo.gridY || 0;

					cardManager.createCardAt(gridX, gridY, text);
				}
			} catch (e) {
				console.error(`加载失败 ${String(e)}`);
			}
		}
	}
}
