import { LoaderManager } from "../../../../javascript_libs/canvas_engine/src/loader/loader_manager.js";
import { BaseCleanUp } from "../../../../javascript_libs/javascript_utils/javascript_utils.js";

export class GameDataLoader extends BaseCleanUp {
	/**
	 * @param {CardStoryGameType.CardStoryGame} game
	 */
	constructor(game) {
		super();

		this.game = game;

		this._onConfigLoaded = this._onConfigLoaded.bind(this);
		this._onSaveLoaded = this._onSaveLoaded.bind(this);
	}

	/**
	 * 加载配置文件
	 */
	load() {
		LoaderManager.addJsonTask("../assets/game_config.json").addLoadedCallback(this._onConfigLoaded);
	}

	/**
	 * 加载存档文件（通常在配置加载完成后调用）
	 */
	loadSave() {
		LoaderManager.addJsonTask("../assets/game_data.json").addLoadedCallback(this._onSaveLoaded);
	}

	/**
	 * @param {JavaScriptUtilsType.JsonTask<CardStoryGameType.GameConfigData>} task
	 */
	_onConfigLoaded(task) {
		if (task.data) {
			this.game.gameConfig.initFromData(task.data);
			console.info("游戏配置加载完成");

			// 配置加载完成后，自动加载存档
			this.loadSave();
		} else {
			console.error("游戏配置加载失败");
		}
	}

	/**
	 * @param {JavaScriptUtilsType.JsonTask<CardStoryGameType.GameData>} task
	 */
	_onSaveLoaded(task) {
		if (task.data && task.data.saveData) {
			const cardManager = this.game.cardManager;
			const cardsData = task.data.saveData.cards || [];

			for (let i = 0, len = cardsData.length; i < len; i++) {
				const saveData = cardsData[i];
				const templateId = saveData.templateId || 0;
				// 直接传入 templateId 和 saveData（包含 gridX, gridY, text）
				cardManager.createCard(templateId, saveData);
			}
			console.info("存档加载完成，共 " + cardsData.length + " 张卡牌");

			throw new Error("存档加载失败");
		}
	}
}
