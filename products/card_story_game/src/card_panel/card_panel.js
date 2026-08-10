import {
	Render2DNode,
	Color,
	RectangleDef,
	TextTexture,
} from "../../../../javascript_libs/canvas_engine/src/canvas_engine.js";
import { Matrix3 } from "../../../../javascript_libs/canvas_engine/src/math/matrix3.js";
import { CardPanelPipe } from "./card_panel_pipe/card_panel_pipe.js";
import { ButtonPool } from "../game_ui/button/button_pool.js";
import { Button } from "../game_ui/button/button.js";

export class CardPanel extends Render2DNode {
	/**
	 * @param {CardStoryGameType.CardStoryGame} cardStoryGame
	 */
	constructor(cardStoryGame) {
		super();

		this.game = cardStoryGame;

		this.bgColor = new Color();
		this.textColor = new Color();

		this.width = 0;
		this.height = 0;
		this.titleHeight = 0;
		this.titleX = 0;
		this.titleY = 0;
		this.descRect = { x: 0, y: 0, width: 0, height: 0 };
		this.descFontSize = 0;
		this.titleTexture = null;
		this.descriptionTexture = null;

		this.geometry = new RectangleDef(0, 0, this.width, this.height);
		this.applyCameraTransform = false;
		this.visible = false;

		this.cacheBufferWidth = -1;
		this.cacheBufferHeight = -1;
		this.cacheTitleText = "";
		this.cacheDescText = "";

		// ---- 新增滚动相关属性 ----
		/** @type {number} 描述文字的实际高度（像素） */
		this.actualDescHeight = 0;
		/** @type {boolean} 是否允许滚动 */
		this.allowScroll = false;
		/** @type {number} 当前滚动的偏移量（像素），范围 0 ~ (actualDescHeight - fixedHeight) */
		this.scrollOffset = 0;
		/** @type {number} 描述区域的固定高度（来自配置） */
		this._descFixedHeight = 80;
		/** @type {Matrix3} UV 变换矩阵，用于滚动 */
		this._descUvTransformMatrix = new Matrix3();
		/** @type {boolean} 滚动方向是否反转 */
		this._scrollInvert = false;

		// ---- 可见尺寸（用于顶点生成和碰撞检测） ----
		/** @type {number} 描述区域可见宽度（像素） */
		this.descVisibleWidth = 0;
		/** @type {number} 描述区域可见高度（像素） */
		this.descVisibleHeight = 0;

		// ---- 按钮相关 ----
		this.buttonPool = new ButtonPool();
		/** @type {Array<Button>} */
		this._activeButtons = [];
		// 默认值，将在 initConfig 中覆盖
		this.buttonPadding = { left: 8, right: 8, top: 4, bottom: 4 };
		this.buttonGapX = 8;
		this.buttonGapY = 8;
		this.buttonMarginTop = 8;
		this.buttonBgColor = new Color(0.3, 0.3, 0.3, 1);
		this.buttonTextColor = new Color(1, 1, 1, 1);
		this.buttonFontSize = 14;
		this.buttonFontFamily = "math";

		this.hide = this.hide.bind(this);
		this.updateSizeAndPosition = this.updateSizeAndPosition.bind(this);
		this.onWheel = this.onWheel.bind(this);

		// 注册滚轮事件
		this.addWheelEvent(this.onWheel);
	}

	get pipe() {
		return CardPanelPipe;
	}

	/**
	 * 根据游戏配置初始化面板参数
	 * @param {CardStoryGameType.GameConfigData} configData - 游戏配置数据（来自 game_config.json）
	 */
	initConfig(configData) {
		const panelUiConfig = configData.uiConfig.panel;
		if (!panelUiConfig) {
			return;
		}

		// 从配置创建颜色对象
		const bgColorObj = panelUiConfig.panelBgColor;
		this.bgColor.setValue(bgColorObj.r, bgColorObj.g, bgColorObj.b, bgColorObj.a);

		const textColorObj = panelUiConfig.panelTextColor;
		this.textColor.setValue(textColorObj.r, textColorObj.g, textColorObj.b, textColorObj.a);

		// 尺寸
		this.width = panelUiConfig.panelWidth;
		this.titleHeight = panelUiConfig.panelTitleHeight;
		this.titleX = panelUiConfig.panelTitleX;
		this.titleY = panelUiConfig.panelTitleY;

		// 描述区域
		const descRect = panelUiConfig.descriptionRect;
		if (descRect) {
			this.descRect.x = descRect.x ?? 8;
			this.descRect.y = descRect.y ?? 30;
			this.descRect.width = descRect.width ?? 284;
			this.descRect.height = descRect.height ?? 80;
			this._descFixedHeight = this.descRect.height;
		}
		this.descFontSize = panelUiConfig.descriptionFontSize ?? 12;

		// 滚动方向
		this._scrollInvert = panelUiConfig.scrollInvert ?? false;

		// 纹理字体选项
		const titleFontSize = panelUiConfig.panelTitleFontSize ?? 16;
		const titleFontFamily = panelUiConfig.panelTitleFontFamily ?? "math";
		const descFontSize = panelUiConfig.panelDescFontSize ?? 12;
		const descFontFamily = panelUiConfig.panelDescFontFamily ?? "math";

		this.titleTexture = new TextTexture("CardPanel-Title", {
			fontSize: titleFontSize,
			fontFamily: titleFontFamily,
			fontWeight: "normal",
		});
		this.descriptionTexture = new TextTexture(
			"CardPanel-Description",
			{
				fontSize: descFontSize,
				fontFamily: descFontFamily,
				fontWeight: "normal",
			},
			this.descRect.width,
		);

		this.zIndex = panelUiConfig.panelZIndex ?? 1000;

		// ---- 按钮配置 ----
		if (panelUiConfig.buttonPadding) {
			this.buttonPadding = panelUiConfig.buttonPadding;
		}
		this.buttonGapX = panelUiConfig.buttonGapX ?? 8;
		this.buttonGapY = panelUiConfig.buttonGapY ?? 8;
		this.buttonMarginTop = panelUiConfig.buttonMarginTop ?? 8;
		const btnBg = panelUiConfig.buttonBgColor;
		this.buttonBgColor.setValue(btnBg.r, btnBg.g, btnBg.b, btnBg.a);
		const btnText = panelUiConfig.buttonTextColor;
		this.buttonTextColor.setValue(btnText.r, btnText.g, btnText.b, btnText.a);
		this.buttonFontSize = panelUiConfig.buttonFontSize ?? 14;
		this.buttonFontFamily = panelUiConfig.buttonFontFamily ?? "math";

		if (this.geometry) {
			this.geometry.max.x = this.width;
			this.geometry.max.y = this.height;
		}
	}

	/**
	 * 显示指定卡牌的详情
	 * @param {CardStoryGameType.Card} card
	 */
	show(card) {
		if (!this.titleTexture || !this.descriptionTexture) {
			return this;
		}
		this.titleTexture.text = card.text;
		const template = this.game.gameConfig.getCardTemplate(card.templateId);
		const desc = template ? template.description || "" : "";
		this.descriptionTexture.text = desc;

		// ---- 更新滚动状态 ----
		this.actualDescHeight = this.descriptionTexture.height;
		const fixedHeight = this._descFixedHeight;
		this.allowScroll = this.actualDescHeight > fixedHeight;
		this.scrollOffset = 0;

		// 计算可见尺寸
		this.descVisibleWidth = this.descriptionTexture.width; // 宽度使用纹理实际宽度
		this.descVisibleHeight = this.allowScroll ? fixedHeight : this.actualDescHeight;

		// 更新 UV 变换矩阵
		this._updateScrollMatrix();

		// ---- 清理旧按钮 ----
		for (let i = 0, len = this._activeButtons.length; i < len; i++) {
			this.buttonPool.release(this._activeButtons[i]);
		}
		this._activeButtons.length = 0;

		// ---- 获取模板的 actions ----
		const actions = template && template.actions ? template.actions : [];
		if (actions.length === 0) {
			this.visible = true;
			return this;
		}

		// ---- 测量每个按钮的文字尺寸 ----
		const buttonInfos = [];
		for (let i = 0, len = actions.length; i < len; i++) {
			const action = actions[i];
			let label, actionId;
			if (typeof action === "object" && action !== null) {
				label = action.label || "Action";
				actionId = action.actionId !== undefined ? action.actionId : i;
			} else {
				actionId = action;
				const globalAction = this.game.gameConfig.getAction(actionId);
				label = globalAction ? globalAction.name : "Action " + actionId;
			}
			// 测量文字宽高
			const tempTex = new TextTexture(label, {
				fontSize: this.buttonFontSize,
				fontFamily: this.buttonFontFamily,
				fontWeight: "normal",
			});
			const textHeight = tempTex.height;
			const textWidth = tempTex.width;
			tempTex.destroy();
			buttonInfos.push({
				label: label,
				actionId: actionId,
				textWidth: textWidth,
				textHeight: textHeight,
			});
		}

		// ---- 计算每个按钮尺寸 ----
		const padding = this.buttonPadding;
		const btnWidths = [];
		const btnHeights = [];
		for (let i = 0, len = buttonInfos.length; i < len; i++) {
			const info = buttonInfos[i];
			const w = info.textWidth + padding.left + padding.right;
			const h = info.textHeight + padding.top + padding.bottom;
			btnWidths.push(w);
			btnHeights.push(h);
		}

		// ---- 换行布局 ----
		const panelMargin = 10; // 左右边距
		const availableWidth = this.width - panelMargin * 2;
		const gapX = this.buttonGapX;
		const gapY = this.buttonGapY;
		const marginTop = this.buttonMarginTop;

		// 描述区域底部 Y（从下往上）
		const descBottomY = this.height - this.descRect.y - this.descVisibleHeight;

		// 当前行底部 Y（从描述区域向下累加）
		let rowBottomY = descBottomY - marginTop;
		let curX = panelMargin;
		let rowMaxHeight = 0;

		// 存储每个按钮的位置和尺寸
		const positions = [];
		for (let i = 0, len = buttonInfos.length; i < len; i++) {
			const w = btnWidths[i];
			const h = btnHeights[i];
			// 检查是否需要换行
			if (curX + w > availableWidth + panelMargin) {
				// 换行
				curX = panelMargin;
				rowBottomY -= rowMaxHeight + gapY;
				rowMaxHeight = 0;
			}
			// 放置按钮（底部对齐）
			const x = curX;
			const y = rowBottomY - h; // 底部对齐，y = 行底部 - 按钮高度
			positions.push({ x, y, width: w, height: h });
			curX += w + gapX;
			if (h > rowMaxHeight) rowMaxHeight = h;
		}

		// ---- 创建/获取按钮并添加到面板 ----
		for (let i = 0, len = buttonInfos.length; i < len; i++) {
			const info = buttonInfos[i];
			const pos = positions[i];
			const config = {
				actionId: info.actionId,
				label: info.label,
				width: pos.width,
				height: pos.height,
				bgColor: this.buttonBgColor,
				textColor: this.buttonTextColor,
				fontSize: this.buttonFontSize,
				fontFamily: this.buttonFontFamily,
				padding: this.buttonPadding,
			};
			const button = this.buttonPool.acquire(config);
			button.x = pos.x;
			button.y = pos.y;
			button.setClickCallback((/** @type {{ actionId: number; }} */ btn) => {
				this._onButtonClick(btn.actionId, card);
			});
			button.applyCameraTransform = false;
			this.add(button);
			this._activeButtons.push(button);
		}

		this.visible = true;
		return this;
	}

	/**
	 * 按钮点击处理
	 * @param {number} actionId
	 * @param {CardStoryGameType.Card} card
	 */
	_onButtonClick(actionId, card) {
		console.info("[CardPanel] 按钮点击: actionId=" + actionId + ", card=" + card.text);
		// TODO: 后续扩展动作执行逻辑
	}

	/**
	 * 隐藏面板（点击空白区域时触发）
	 * @param {CanvasEngineType.Scene2D} _scene2d
	 * @param {number} _x
	 * @param {number} _y
	 * @param {number} _sx
	 * @param {number} _sy
	 * @param {boolean} [hasMovedAfterDown]
	 */
	hide(_scene2d, _x, _y, _sx, _sy, hasMovedAfterDown) {
		if (!hasMovedAfterDown) {
			for (let i = 0, len = this._activeButtons.length; i < len; i++) {
				this.buttonPool.release(this._activeButtons[i]);
			}
			this._activeButtons.length = 0;
			this.visible = false;
		}
		return this;
	}

	/**
	 * 根据画布尺寸更新面板大小和位置
	 * @param {number} canvasWidth
	 * @param {number} canvasHeight
	 */
	updateSizeAndPosition(canvasWidth, canvasHeight) {
		const panelUiConfig = this.game?.gameConfig.uiConfig.panel;
		if (!panelUiConfig) return;

		const ratio = panelUiConfig.panelHeightRatio ?? 0.8;
		this.height = canvasHeight * ratio;

		// ---- 新坐标系适配（原点在中心，X向右为正，Y向上为正） ----
		// 面板贴在右侧边缘：X = 右边缘 - 面板宽度
		this.x = canvasWidth / 2 - this.width;

		// 从顶部向下偏移：顶部是 -canvasHeight/2，向下为 Y 负方向
		const yOffset =
			canvasHeight > 400
				? (panelUiConfig.panelYOffset ?? 20)
				: canvasHeight * (panelUiConfig.panelYOffsetSmall ?? 0.05);
		this.y = canvasHeight / 2 - this.height - yOffset;

		if (this.geometry) {
			this.geometry.max.x = this.width;
			this.geometry.max.y = this.height;
		}

		this.matrixNeedUpdate = true;
		this.worldMatrixNeedUpdate = true;
	}

	// ===== 滚动逻辑 =====

	/**
	 * 更新 UV 变换矩阵，根据 scrollOffset 和 actualDescHeight 计算
	 * @private
	 */
	_updateScrollMatrix() {
		const fixedHeight = this._descFixedHeight;
		const actualHeight = this.actualDescHeight;

		if (!this.allowScroll || actualHeight <= fixedHeight) {
			this._descUvTransformMatrix.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
			return;
		}

		// 计算缩放和平移
		const scale = fixedHeight / actualHeight;
		const offset = this.scrollOffset / actualHeight;

		// 构建变换矩阵：将 UV 从 [0,1] 映射到 [offset, offset+scale]
		// 行主序： [1, 0, 0]
		//          [0, scale, offset]
		//          [0, 0, 1]
		this._descUvTransformMatrix.set(1, 0, 0, 0, scale, offset, 0, 0, 1);
	}

	/**
	 * 滚轮事件处理函数
	 * @param {CanvasEngineType.RenderEventNode} _node
	 * @param {number} _dx
	 * @param {number} dy
	 * @param {number} _dz
	 * @param {number} _x - 相机空间坐标（已应用相机变换）
	 * @param {number} _y - 相机空间坐标（已应用相机变换）
	 * @param {number} sx - 世界坐标 X（由于面板 applyCameraTransform=false，此处等于屏幕坐标）
	 * @param {number} sy - 世界坐标 Y（由于面板 applyCameraTransform=false，此处等于屏幕坐标）
	 */
	onWheel(_node, _dx, dy, _dz, _x, _y, sx, sy) {
		// 面板不可见时忽略
		if (!this.visible) return;

		// 计算描述区域的世界坐标边界
		// 描述矩形的局部左下角 Y = this.height - this.descRect.y - this.descVisibleHeight
		const descYLocal = this.height - this.descRect.y - this.descVisibleHeight;
		const panelX = this.x;
		const panelY = this.y;
		const rectX = panelX + this.descRect.x;
		const rectY = panelY + descYLocal;
		const rectW = this.descVisibleWidth;
		const rectH = this.descVisibleHeight;

		// 因为 applyCameraTransform 为 false，所以使用 sx，sy 坐标判断
		if (sx < rectX || sx > rectX + rectW || sy < rectY || sy > rectY + rectH) {
			return;
		}

		// 无需滚动
		if (!this.allowScroll) return;

		// 计算滚动增量
		let delta = dy; // 垂直滚动量
		if (this._scrollInvert) {
			delta = -delta;
		}

		// 更新滚动偏移，并限制范围
		const maxOffset = this.actualDescHeight - this._descFixedHeight;
		this.scrollOffset = Math.max(0, Math.min(maxOffset, this.scrollOffset + delta));

		// 更新矩阵
		this._updateScrollMatrix();
	}

	destroy() {
		if (this.buttonPool) {
			this.buttonPool.clear();
		}
		if (this.titleTexture) {
			this.titleTexture.destroy();
		}
		if (this.descriptionTexture) {
			this.descriptionTexture.destroy();
		}
		this.bgColor.destroy();
		this.textColor.destroy();
		this.buttonBgColor.destroy();
		this.buttonTextColor.destroy();

		super.destroy();
	}
}
