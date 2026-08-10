import { Render2DNode } from "../../../../../javascript_libs/canvas_engine/src/render_nodes/2d/render_2d_node.js";
import { Color } from "../../../../../javascript_libs/canvas_engine/src/math/color.js";
import { RectangleDef } from "../../../../../javascript_libs/canvas_engine/src/math/geometry_2d_defs/rectangle_def.js";
import { TextTexture } from "../../../../../javascript_libs/canvas_engine/src/textures/text_texture.js";
import { ButtonPipe } from "./button_pipe/button_pipe.js";

/**
 * @typedef {Object} ButtonConfig
 * @property {number} actionId - 动作ID（全局或内联）
 * @property {string} label - 按钮显示文字
 * @property {number} width - 按钮宽度（由面板统一计算）
 * @property {number} height - 按钮高度
 * @property {Color} bgColor - 背景色
 * @property {Color} textColor - 文字颜色
 * @property {number} fontSize - 文字字号
 * @property {string} fontFamily - 字体族
 * @property {Object} padding - 内边距
 * @property {number} padding.left - 左内边距
 * @property {number} padding.right - 右内边距
 * @property {number} padding.top - 上内边距
 * @property {number} padding.bottom - 下内边距
 */

export class Button extends Render2DNode {
	/**
	 * @param {ButtonConfig} config
	 */
	constructor(config) {
		super();

		this.actionId = config.actionId;
		this.label = config.label;

		this.width = config.width;
		this.height = config.height;

		// padding 存储
		this.padding = config.padding || { left: 8, right: 8, top: 4, bottom: 4 };

		this.bgColor = config.bgColor;
		this.textColor = config.textColor;

		this.textTexture = new TextTexture(this.label, {
			fontSize: config.fontSize,
			fontFamily: config.fontFamily,
			fontWeight: "normal",
		});

		this.geometry = new RectangleDef(0, 0, this.width, this.height);

		this._clickCallback = null; // 外部绑定
	}

	get pipe() {
		return ButtonPipe;
	}

	/**
	 * 设置点击回调
	 * @param {Function} callback - (button: Button) => void
	 * @returns {this}
	 */
	setClickCallback(callback) {
		this._clickCallback = callback;
		// 添加点击事件，触发回调
		this.addClickEvent((node, x, y, sx, sy, hasMoved) => {
			if (this._clickCallback) {
				this._clickCallback(this);
			}
		});
		return this;
	}

	/**
	 * @param {number} width
	 * @param {number} height
	 */
	setSize(width, height) {
		this.width = width;
		this.height = height;
		if (this.geometry) {
			this.geometry.max.x = width;
			this.geometry.max.y = height;
		}
		this.matrixNeedUpdate = true;
		this.worldMatrixNeedUpdate = true;
		return this;
	}

	/**
	 * 重置按钮状态（用于回收时清理）
	 */
	reset() {
		this.actionId = -1;
		this.label = "";
		this._clickCallback = null;
		// 纹理不会回收，只改变文本
		if (this.textTexture) {
			this.textTexture.text = "";
		}
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
