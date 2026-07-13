import { Render2DNode } from "../../../../../../javascript_libs/canvas_engine/src/render_nodes/2d/render_2d_node.js";
import { Color } from "../../../../../../javascript_libs/canvas_engine/src/math/color.js";
import { RectangleDef } from "../../../../../../javascript_libs/canvas_engine/src/math/geometry_2d_defs/rectangle_def.js";
import { TextTexture } from "../../../../../../javascript_libs/canvas_engine/src/textures/text_texture.js";
import { BaseCardPipe } from "./base_card_pipe/base_card_pipe.js";
import { CardManager } from "../../card_manager.js";

export class BaseCard extends Render2DNode {
	text = "";
	bgColor;
	textColor;
	textTexture;
	gridX = 0;
	gridY = 0;
	gridPositionKey = 0;
	_cacheBufferWidth = -1;
	_cacheBufferHeight = -1;

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

		this.textTexture = new TextTexture(text, {
			fontSize: 12,
			fontFamily: "Arial",
			fontWeight: "bold",
		});

		this.text = text;

		this.dragUpdatePosition = true;
		this.centerSelf();
	}

	get pipe() {
		return BaseCardPipe;
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

	destroy() {
		if (this.textTexture) {
			this.textTexture.destroy();
		}
		this.bgColor.destroy();
		this.textColor.destroy();
		super.destroy();
	}
}
