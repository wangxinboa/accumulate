import {
	Render2DNode,
	Color,
	RectangleDef,
	TextTexture,
} from "../../../../javascript_libs/canvas_engine/src/canvas_engine.js";
import { Matrix3 } from "../../../../javascript_libs/canvas_engine/src/math/matrix3.js";
import { PanelPipe } from "./panel_pipe/panel_pipe.js";

export class Panel extends Render2DNode {
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
		this._descFixedHeight = 60;
		/** @type {Matrix3} UV 变换矩阵，用于滚动 */
		this._uvTransformMatrix = new Matrix3();
		/** @type {boolean} 滚动方向是否反转 */
		this._scrollInvert = false;

		// ---- 可见尺寸（用于顶点生成和碰撞检测） ----
		/** @type {number} 描述区域可见宽度（像素） */
		this.descVisibleWidth = 0;
		/** @type {number} 描述区域可见高度（像素） */
		this.descVisibleHeight = 0;

		this.hide = this.hide.bind(this);
		this.updateSizeAndPosition = this.updateSizeAndPosition.bind(this);
		this.onWheel = this.onWheel.bind(this);

		// 注册滚轮事件
		this.addWheelEvent(this.onWheel);
	}

	get pipe() {
		return PanelPipe;
	}

	/**
	 * 根据游戏配置初始化面板参数
	 * @param {CardStoryGameType.GameConfigData} configData - 游戏配置数据（来自 game_config.json）
	 */
	initConfig(configData) {
		const uiConfig = configData.uiConfig;
		if (!uiConfig) {
			return;
		}

		// 从配置创建颜色对象
		const bgColorObj = uiConfig.panelBgColor;
		this.bgColor.setValue(bgColorObj.r, bgColorObj.g, bgColorObj.b, bgColorObj.a);

		const textColorObj = uiConfig.panelTextColor;
		this.textColor.setValue(textColorObj.r, textColorObj.g, textColorObj.b, textColorObj.a);

		// 尺寸
		this.width = uiConfig.panelWidth;
		this.titleHeight = uiConfig.panelTitleHeight;
		this.titleX = uiConfig.panelTitleX;
		this.titleY = uiConfig.panelTitleY;

		// 描述区域
		const descRect = uiConfig.descriptionRect;
		if (descRect) {
			this.descRect.x = descRect.x ?? 8;
			this.descRect.y = descRect.y ?? 30;
			this.descRect.width = descRect.width ?? 284;
			this.descRect.height = descRect.height ?? 60;
			this._descFixedHeight = this.descRect.height;
		}
		this.descFontSize = uiConfig.descriptionFontSize ?? 12;

		// 滚动方向
		this._scrollInvert = uiConfig.scrollInvert ?? false;

		// 纹理字体选项
		const titleFontSize = uiConfig.panelTitleFontSize ?? 16;
		const titleFontFamily = uiConfig.panelTitleFontFamily ?? "math";
		const descFontSize = uiConfig.panelDescFontSize ?? 12;
		const descFontFamily = uiConfig.panelDescFontFamily ?? "math";

		this.titleTexture = new TextTexture("Panel-Title", {
			fontSize: titleFontSize,
			fontFamily: titleFontFamily,
			fontWeight: "normal",
		});
		this.descriptionTexture = new TextTexture(
			"Panel-Description",
			{
				fontSize: descFontSize,
				fontFamily: descFontFamily,
				fontWeight: "normal",
			},
			this.descRect.width, // 换行宽度
		);

		this.zIndex = uiConfig.panelZIndex ?? 1000;

		// 更新几何
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

		this.visible = true;
		return this;
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
		const uiConfig = this.game?.gameConfig?.uiConfig;
		if (!uiConfig) return;

		const ratio = uiConfig.panelHeightRatio ?? 0.8;
		this.height = canvasHeight * ratio;

		// ---- 新坐标系适配（原点在中心，X向右为正，Y向上为正） ----
		// 面板贴在右侧边缘：X = 右边缘 - 面板宽度
		this.x = canvasWidth / 2 - this.width;

		// 从顶部向下偏移：顶部是 -canvasHeight/2，向下为 Y 负方向
		const yOffset =
			canvasHeight > 400 ? (uiConfig.panelYOffset ?? 20) : canvasHeight * (uiConfig.panelYOffsetSmall ?? 0.05);
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
			// 无需滚动，设为单位矩阵
			this._uvTransformMatrix.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
			return;
		}

		// 计算缩放和平移
		const scale = fixedHeight / actualHeight;
		const offset = this.scrollOffset / actualHeight;

		// 构建变换矩阵：将 UV 从 [0,1] 映射到 [offset, offset+scale]
		// 行主序： [1, 0, 0]
		//          [0, scale, offset]
		//          [0, 0, 1]
		this._uvTransformMatrix.set(1, 0, 0, 0, scale, offset, 0, 0, 1);
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

	// ===== 销毁 =====
	destroy() {
		if (this.titleTexture) {
			this.titleTexture.destroy();
		}
		if (this.descriptionTexture) {
			this.descriptionTexture.destroy();
		}
		this.bgColor.destroy();
		this.textColor.destroy();
		super.destroy();
	}
}
