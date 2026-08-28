import {
	Render2DNode,
	RectangleDef,
	Color,
} from "../../../../../../javascript_libs/canvas_engine/src/canvas_engine.js";
import { CardPanelSlotPipe } from "./card_panel_slot_pipe/card_panel_slot_pipe.js";

export class CardPanelSlot extends Render2DNode {
	constructor() {
		super();

		// 默认背景色（半透明灰色）
		this.bgColor = new Color(0.1, 0.1, 0.1, 0.5);

		// 默认尺寸
		this.width = 60;
		this.height = 90;

		this.geometry = new RectangleDef(0, 0, this.width, this.height);

		this.needUpdateBuffer = true;
	}

	get pipe() {
		return CardPanelSlotPipe;
	}

	/**
	 * 根据配置更新槽位样式
	 * @param {CardStoryGameType.UIConfig['panel']['panelSlotArea']['slotOption']} slotOption - 槽位配置
	 */
	updateConfig(slotOption) {
		const bg = slotOption.bgColor;
		this.bgColor.setValue(bg.r, bg.g, bg.b, bg.a);

		if (this.width !== slotOption.width) {
			this.width = slotOption.width;
			this.geometry.max.x = this.width;
			this.needUpdateBuffer = true;
		}
		if (this.height !== slotOption.height) {
			this.height = slotOption.height;
			this.geometry.max.y = this.height;
			this.needUpdateBuffer = true;
		}
	}

	/**
	 * 重置槽位到默认状态（用于回收到池中之前清理）
	 */
	reset() {
		this.bgColor.setValue(0.1, 0.1, 0.1, 0.5);
		this.width = 60;
		this.height = 90;

		if (this.geometry) {
			this.geometry.max.x = this.width;
			this.geometry.max.y = this.height;
		}

		this._bufferDirty = true;
		this.matrixNeedUpdate = true;
		this.worldMatrixNeedUpdate = true;
	}

	destroy() {
		this.bgColor.destroy();
		super.destroy();
	}
}
