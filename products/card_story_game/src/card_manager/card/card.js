import { Render2DNode } from "../../../../../javascript_libs/canvas_engine/src/render_nodes/2d/render_2d_node.js";
import { Color } from "../../../../../javascript_libs/canvas_engine/src/math/color.js";
import { RectangleDef } from "../../../../../javascript_libs/canvas_engine/src/math/geometry_2d_defs/rectangle_def.js";
import { TextTexture } from "../../../../../javascript_libs/canvas_engine/src/textures/text_texture.js";
import { CardPipe } from "./card_pipe/card_pipe.js";
import { CardManager } from "../card_manager.js";

const textOption = {
	fontSize: 12,
	fontFamily: "Arial",
};

export class Card extends Render2DNode {
	text = "";
	bgColor;
	textColor;
	textTexture;
	gridX = 0;
	gridY = 0;
	gridPositionKey = 0;
	cacheBufferWidth = -1;
	cacheBufferHeight = -1;

	/**
	 * @param {string} text
	 */
	constructor(text) {
		super();

		this.bgColor = new Color(0.2, 0.4, 0.8, 1);
		this.textColor = new Color(0, 0, 0, 1);

		this.width = CardManager.cardWidth;
		this.height = CardManager.cardHeight;

		this.geometry = new RectangleDef(0, 0, this.width, this.height);

		this.textTexture = new TextTexture(text, textOption);

		this.text = text;

		this.dragUpdatePosition = true;
		this.centerSelf();
	}

	get pipe() {
		return CardPipe;
	}

	/**
	 * @param {number} worldX
	 * @param {number} worldY
	 * @param {number} gridX
	 * @param {number} gridY
	 */
	updatePosition(worldX, worldY, gridX, gridY) {
		this.x = worldX;
		this.y = worldY;
		this.gridX = gridX;
		this.gridY = gridY;
		this.gridPositionKey = CardManager.getGridPositionKey(gridX, gridY);
		return this;
	}

	/**
	 * 自定义 JSON 序列化，只导出必要字段，避免循环引用
	 * @returns {object} 可序列化的卡牌数据
	 */
	toJSON() {
		return {
			text: this.text,
			gridX: this.gridX,
			gridY: this.gridY,
		};
	}

	destroy() {
		if (this.textTexture) {
			this.textTexture.destroy();
		}
		this.bgColor.destroy();
		this.textColor.destroy();
		super.destroy();
	}
}
