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
		this._onGameDataLoaded = this._onGameDataLoaded.bind(this);
	}

	/**
	 * 加载配置文件
	 */
	loadConfig() {
		console.info("开始加载游戏配置");
		LoaderManager.addJsonTask("../assets/game_config.json").addLoadedCallback(this._onConfigLoaded);
		return this;
	}

	/**
	 * 加载存档文件（通常在配置加载完成后调用）
	 */
	loadGameData() {
		console.info("开始加载游戏信息");
		LoaderManager.addJsonTask("../assets/game_data.json").addLoadedCallback(this._onGameDataLoaded);
		return this;
	}

	/**
	 * @param {JavaScriptUtilsType.JsonTask<CardStoryGameType.GameConfigData>} task
	 */
	_onConfigLoaded(task) {
		if (task.data) {
			this.game.onConfigLoaded(task.data);
			console.info("游戏配置加载完成");
			// 配置加载完成后，自动加载存档
			this.loadGameData();
		} else {
			console.error("游戏配置加载失败");
		}
	}

	/**
	 * @param {JavaScriptUtilsType.JsonTask<CardStoryGameType.GameData>} task
	 */
	_onGameDataLoaded(task) {
		if (task.data) {
			this.game.onGameDataLoaded(task.data);
		} else {
			console.error("存档加载失败");
		}
	}
}
