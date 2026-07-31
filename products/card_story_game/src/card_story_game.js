import { BaseCleanUp } from "../../../javascript_libs/javascript_utils/javascript_utils.js";
import { Canvas2DEngine } from "../../../javascript_libs/canvas_engine/src/canvas_engine.js";
import { CardManager } from "./card_manager/card_manager.js";
import { GameDataLoader } from "./game_data/game_data_loader.js";
import { GameDataExporter } from "./game_data/game_data_exporter.js";
import { GameConfig } from "./game_data/game_config.js";
import { downloadFile } from "../../../javascript_libs/javascript_utils/javascript_utils.js";
import { Panel } from "./panel/panel.js";

export class CardStoryGame extends BaseCleanUp {
	constructor() {
		super();

		this.engine = new Canvas2DEngine({
			container: document.body,
			rendererType: "webgl",
			autoStart: true,
			waitLoadingCompleteStart: false,
			backgroundColor: 0xff0000,
		});
		this.engine.camera.dragUpdatePosition = true;

		// 游戏配置
		this.gameConfig = new GameConfig();

		this.cardManager = new CardManager(this);

		this.panel = new Panel();
		this.engine.scene.add(this.panel);

		this.engine.scene.addMouseUpEventWhenNoNodeHit(this.panel.hide);

		this.loader = new GameDataLoader(this);
		this.exporter = new GameDataExporter(this);

		this.resize = this.resize.bind(this);
		this.engine.addResizeCallback(this.resize);
		this.resize();
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

	destroy() {
		this.gameConfig.destroy();
		this.engine.destroy();
		this.cardManager.destroy();
		this.loader.destroy();
		if (this.panel) {
			this.panel.destroy();
		}
		super.destroy();
	}
}
