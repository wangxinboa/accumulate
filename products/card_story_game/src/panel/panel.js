import {
	Render2DNode,
	Color,
	RectangleDef,
	TextTexture,
} from "../../../../javascript_libs/canvas_engine/src/canvas_engine.js";

import { PanelPipe } from "./panel_pipe/panel_pipe.js";

const textOption = {
	fontSize: 14,
	fontFamily: "Arial",
	fontWeight: "normal",
};

export class Panel extends Render2DNode {
	static zIndex = 1000;

	constructor() {
		super();

		this.bgColor = new Color(0.2, 0.2, 0.3, 0.9);
		this.textColor = new Color(1, 1, 1, 1);

		this.width = 300;
		this.height = 0;

		// ---- 标题绘制参数（由变量控制） ----
		this.titleHeight = 14; // 固定高度
		this.titleX = 8; // 固定 X 偏移（相对于面板左上角）
		this.titleY = 8; // 固定 Y 偏移（相对于面板左上角）

		this.geometry = new RectangleDef(0, 0, this.width, this.height);

		this.titleTexture = new TextTexture("Panel", textOption);
		this.applyCameraTransform = false;
		this.visible = false;

		this.cacheBufferWidth = -1;
		this.cacheBufferHeight = -1;
		this.cacheTitleText = this.titleTexture.text;

		this.hide = this.hide.bind(this);
		this.updateSizeAndPosition = this.updateSizeAndPosition.bind(this);

		this.zIndex = Panel.zIndex;
	}

	get pipe() {
		return PanelPipe;
	}

	/**
	 * @param {CardStoryGameType.Card} card
	 */
	show(card) {
		this.titleTexture.text = card.text;
		this.visible = true;
		return this;
	}

	/**
	 * @param {CanvasEngineType.Scene2D} _scene2d
	 * @param {number} _x
	 * @param {number} _y
	 * @param {number} _sx
	 * @param {number} _sy
	 * @param {boolean} [hasMovedAfterDown]
	 */
	hide(_scene2d, _x, _y, _sx, _sy, hasMovedAfterDown) {
		if (!hasMovedAfterDown) {
			this.visible = false;
		}
		return this;
	}

	/**
	 * @param {number} canvasWidth
	 * @param {number} canvasHeight
	 */
	updateSizeAndPosition(canvasWidth, canvasHeight) {
		this.height = canvasHeight * 0.8;

		this.x = canvasWidth - this.width;
		this.y = canvasHeight > 400 ? 20 : canvasHeight * 0.05;

		if (this.geometry) {
			this.geometry.max.x = this.width;
			this.geometry.max.y = this.height;
		}

		// 标记矩阵需要更新
		this.matrixNeedUpdate = true;
		this.worldMatrixNeedUpdate = true;
	}

	destroy() {
		if (this.titleTexture) {
			this.titleTexture.destroy();
		}
		this.bgColor.destroy();
		this.textColor.destroy();
		super.destroy();
	}
}
