import { Render2DNode } from "../../../../../javascript_libs/canvas_engine/src/render_nodes/2d/render_2d_node.js";
import { Color } from "../../../../../javascript_libs/canvas_engine/src/math/color.js";
import { RectangleDef } from "../../../../../javascript_libs/canvas_engine/src/math/geometry_2d_defs/rectangle_def.js";
import { TextTexture } from "../../../../../javascript_libs/canvas_engine/src/textures/text_texture.js";
import { CardPipe } from "./card_pipe/card_pipe.js";

export class Card extends Render2DNode {
	/** @type {number} 模板 ID，关联到 GameConfig 中的模板 */
	templateId = 0;
	/** @type {string} 卡牌显示文本 */
	text = "";
	/** @type {Color} 背景色 */
	bgColor;
	/** @type {Color} 文字颜色 */
	textColor;
	/** @type {TextTexture} 文字纹理 */
	textTexture;
	/** @type {number} 网格 X 坐标 */
	gridX = 0;
	/** @type {number} 网格 Y 坐标 */
	gridY = 0;
	/** @type {number} 网格位置唯一键 */
	gridPositionKey = 0;
	/** @type {number} 缓存宽（用于 buffer 更新检测） */
	cacheBufferWidth = -1;
	/** @type {number} 缓存高（用于 buffer 更新检测） */
	cacheBufferHeight = -1;
	/** @type {CardStoryGameType.CardStoryGame} 游戏实例引用 */
	game;

	/**
	 * @param {number} templateId - 模板 ID
	 * @param {CardStoryGameType.CardStoryGame} game - 游戏实例
	 */
	constructor(templateId, game) {
		super();

		this.templateId = templateId;
		this.game = game;

		// 从配置中获取模板数据
		const template = game.gameConfig.getCardTemplate(templateId);
		if (!template) {
			throw new Error("模板 " + templateId + " 不存在");
		}
		this.text = template.name || "Card";

		const cardUiConfig = game.gameConfig.uiConfig.card;

		// 从配置创建颜色对象
		const bgColorObj = cardUiConfig.bgColor;
		this.bgColor = new Color(bgColorObj.r, bgColorObj.g, bgColorObj.b, bgColorObj.a);

		const textColorObj = cardUiConfig.textColor;
		this.textColor = new Color(textColorObj.r, textColorObj.g, textColorObj.b, textColorObj.a);

		this.width = cardUiConfig.width;
		this.height = cardUiConfig.height;

		this.geometry = new RectangleDef(0, 0, this.width, this.height);

		// 文字纹理
		this.textTexture = new TextTexture(this.text, {
			fontSize: cardUiConfig.fontSize,
			fontFamily: cardUiConfig.fontFamily,
			fontWeight: "normal",
		});

		this.dragUpdatePosition = true;
		this.centerSelf();
	}

	get pipe() {
		return CardPipe;
	}

	/**
	 * 更新卡牌位置和网格坐标
	 * @param {number} gridPositionKey - 网格位置唯一键
	 * @param {number} worldX
	 * @param {number} worldY
	 * @param {number} gridX
	 * @param {number} gridY
	 * @returns {this}
	 */
	updatePosition(gridPositionKey, worldX, worldY, gridX, gridY) {
		this.x = worldX;
		this.y = worldY;
		this.gridX = gridX;
		this.gridY = gridY;
		this.gridPositionKey = gridPositionKey;
		return this;
	}

	/**
	 * @param {number} zIndex
	 */
	changeZIndex(zIndex) {
		this.zIndex = zIndex;
		if (this.parent) {
			this.parent.sortChildren();
		}
	}

	/**
	 * 自定义 JSON 序列化，只导出必要字段，避免循环引用
	 * @returns {object} 可序列化的卡牌数据
	 */
	toJSON() {
		return {
			templateId: this.templateId,
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
