import { BaseCleanUp } from "../../../javascript_libs/javascript_utils/javascript_utils.js";
import { Canvas2DEngine } from "../../../javascript_libs/canvas_engine/src/canvas_engine.js";
import { CardManager } from "./card_manager/card_manager.js";
import { GameDataExporter } from "./game_data/game_data_exporter.js";
import { GameDataLoader } from "./game_data/game_data_loader.js";

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

		this.cardManager = new CardManager(this);

		this.resize = this.resize.bind(this);
		this.engine.addResizeCallback(this.resize);
		this.resize();

		this.loader = new GameDataLoader(this);
	}

	resize() {
		this.engine.scene.x = this.engine.camera.width / 2;
		this.engine.scene.y = this.engine.camera.height / 2;
		this.engine.scene.updateMatrixWorld(true);
	}

	/**
	 * 导出当前游戏状态为 JSON 字符串
	 */
	exportGameData() {
		GameDataExporter.export(this);
	}

	destroy() {
		this.cardManager.destroy();
		this.engine.destroy();
		this.loader.destroy();

		super.destroy();
	}
}
