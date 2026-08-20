import { BaseCleanUp } from "../../../javascript_libs/javascript_utils/javascript_utils.js";
import { Canvas2DEngine } from "../../../javascript_libs/canvas_engine/src/canvas_engine.js";
import { CardManager } from "./card_manager/card_manager.js";
import { GameDataLoader } from "./game_data/game_data_loader.js";
import { GameDataExporter } from "./game_data/game_data_exporter.js";
import { GameConfig } from "./game_data/game_config.js";
import { downloadFile } from "../../../javascript_libs/javascript_utils/javascript_utils.js";
import { CardPanel } from "./card_panel/card_panel.js";
import { ButtonPool } from "./game_ui/button/button_pool.js";

export class CardStoryGame extends BaseCleanUp {
	constructor() {
		super();

		this.gameConfig = new GameConfig();

		this.engine = new Canvas2DEngine({
			container: document.body,
			rendererType: "webgl",
			autoStart: true,
			waitLoadingCompleteStart: false,
			backgroundColor: 0x000000,
		});
		this.engine.camera.dragUpdatePosition = true;

		this.cardManager = new CardManager(this);

		this.buttonPool = new ButtonPool();
		this.panel = new CardPanel(this);
		this.engine.scene.add(this.panel);

		this.engine.scene.addMouseUpEventWhenNoNodeHit(this.panel.hide);

		this.resize = this.resize.bind(this);
		this.engine.addResizeCallback(this.resize);
		this.resize();

		this.loader = new GameDataLoader(this).loadConfig();
		this.exporter = new GameDataExporter(this);
	}

	resize() {
		this.panel.updateSizeAndPosition(this.engine.camera.width, this.engine.camera.height);
	}

	/**
	 * @param {CardStoryGameType.Card} card
	 */
	addCard(card) {
		this.engine.scene.add(card);
	}

	/**
	 * @param {CardStoryGameType.Card} card
	 */
	removeCard(card) {
		this.engine.scene.remove(card);
	}

	/**
	 * 导出游戏数据，并可选下载 JSON 文件
	 * @param {boolean} [download=true] - 是否下载文件
	 * @returns {string} JSON 字符串
	 */
	exportGameData(download = true) {
		const jsonStr = this.exporter.export();
		if (download) {
			downloadFile("game_data.json", jsonStr, "application/json");
		}
		return jsonStr;
	}

	/**
	 * 配置加载完成后的回调
	 * @param {CardStoryGameType.GameConfigData} configData
	 */
	onConfigLoaded(configData) {
		this.gameConfig.initConfig(configData);

		// 设置引擎背景色（使用 RGBA 对象）
		const bg = configData.uiConfig.engineBackgroundColor;
		this.engine.renderer.backgroundSystem.color.setValue(bg.r, bg.g, bg.b, bg.a);

		this.cardManager.initConfig(this.gameConfig.uiConfig.card);

		this.panel.updateConfig(this.gameConfig.uiConfig.panel);
		this.panel.updateSizeAndPosition(this.engine.camera.width, this.engine.camera.height);

		console.info("配置加载完成");
	}

	/**
	 * @param {CardStoryGameType.GameData} gameData
	 */
	onGameDataLoaded(gameData) {
		const cardsData = gameData.saveData?.cards || [];
		for (let i = 0, len = cardsData.length; i < len; i++) {
			const saveData = cardsData[i];
			const templateId = saveData.templateId;
			this.cardManager.createCard(templateId, saveData);
		}
		console.info("存档加载完成，共 " + cardsData.length + " 张卡牌");
	}

	destroy() {
		this.gameConfig.destroy();
		this.engine.destroy();
		this.cardManager.destroy();
		this.buttonPool.destroy();
		this.panel.destroy();
		this.loader.destroy();
		this.exporter.destroy();
		super.destroy();
	}
}
