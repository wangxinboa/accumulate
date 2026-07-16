import { BaseCleanUp, TweenManager } from "../../../javascript_utils/javascript_utils.js";
import {
	GlBlendParamTypeEnum,
	GlBlendEquationTypeEnum,
} from "../renderers/webgl_renderer/webgl_state/webgl_state_constants.js";

let renderNodeId = 0;

/**
 * @param {RenderNode} a
 * @param {RenderNode} b
 */
function sortChildren(a, b) {
	return a.zIndex - b.zIndex;
}

export class RenderNode extends BaseCleanUp {
	/** @type {string} */
	id;
	/** @type {boolean} */
	isRenderNode;
	/** @type {RenderNode | null} */
	parent;
	/** @type {Array<RenderNode>} */
	children;
	/** @type {boolean} */
	visible;
	/** @type {TweenManager} */
	tweenManager;
	/** @type {number} */
	zIndex;

	// ===== 混合状态属性 =====
	/** @type {boolean} 是否启用混合 */
	enableBlend;
	/** @type {CanvasEngineType.GlBlendParamTypeEnum} 源 RGB 混合因子 */
	srcRGB;
	/** @type {CanvasEngineType.GlBlendParamTypeEnum} 目标 RGB 混合因子 */
	dstRGB;
	/** @type {CanvasEngineType.GlBlendParamTypeEnum} 源 Alpha 混合因子 */
	srcAlpha;
	/** @type {CanvasEngineType.GlBlendParamTypeEnum} 目标 Alpha 混合因子 */
	dstAlpha;
	/** @type {CanvasEngineType.GlBlendEquationTypeEnum} RGB 混合方程 */
	equationRGB;
	/** @type {CanvasEngineType.GlBlendEquationTypeEnum} Alpha 混合方程 */
	equationAlpha;

	/** @type {boolean} */
	matrixNeedUpdate;

	constructor() {
		super();

		this.id = `${renderNodeId++}`;
		this.isRenderNode = true;

		this.parent = null;
		this.children = [];

		this.visible = true;

		this.tweenManager = new TweenManager();

		this.zIndex = 0;

		// 初始化混合状态为默认值（标准透明混合）
		this.enableBlend = true;
		this.srcRGB = GlBlendParamTypeEnum.SRC_ALPHA;
		this.dstRGB = GlBlendParamTypeEnum.ONE_MINUS_SRC_ALPHA;
		this.srcAlpha = GlBlendParamTypeEnum.ZERO;
		this.dstAlpha = GlBlendParamTypeEnum.ONE;
		this.equationRGB = GlBlendEquationTypeEnum.FUNC_ADD;
		this.equationAlpha = GlBlendEquationTypeEnum.FUNC_ADD;

		this.matrixNeedUpdate = false;
		this._worldMatrixNeedUpdate = false;
	}

	get worldMatrixNeedUpdate() {
		return this._worldMatrixNeedUpdate;
	}

	set worldMatrixNeedUpdate(val) {
		if (this._worldMatrixNeedUpdate !== val) {
			this._worldMatrixNeedUpdate = val;

			if (val) {
				for (let i = 0, len = this.children.length; i < len; i++) {
					this.children[i].worldMatrixNeedUpdate = val;
				}
			}
		}
	}

	/**
	 * 开启混合（链式调用）
	 * @returns {this}
	 */
	enableBlendMode() {
		this._enableBlend = true;
		return this;
	}

	/**
	 * 关闭混合（链式调用）
	 * @returns {this}
	 */
	disableBlendMode() {
		this._enableBlend = false;
		return this;
	}

	/**
	 * 设置完整的混合状态（链式调用）
	 * @param {CanvasEngineType.GlBlendParamTypeEnum} srcRGB - 源 RGB 因子
	 * @param {CanvasEngineType.GlBlendParamTypeEnum} dstRGB - 目标 RGB 因子
	 * @param {CanvasEngineType.GlBlendParamTypeEnum} [srcAlpha] - 源 Alpha 因子，不传则与 srcRGB 相同
	 * @param {CanvasEngineType.GlBlendParamTypeEnum} [dstAlpha] - 目标 Alpha 因子，不传则与 dstRGB 相同
	 * @param {CanvasEngineType.GlBlendEquationTypeEnum} [equationRGB] - RGB 方程，默认 FUNC_ADD
	 * @param {CanvasEngineType.GlBlendEquationTypeEnum} [equationAlpha] - Alpha 方程，默认与 equationRGB 相同
	 * @returns {this}
	 */
	setBlendState(srcRGB, dstRGB, srcAlpha, dstAlpha, equationRGB = GlBlendEquationTypeEnum.FUNC_ADD, equationAlpha) {
		this.srcRGB = srcRGB;
		this.dstRGB = dstRGB;
		this.srcAlpha = srcAlpha ?? srcRGB;
		this.dstAlpha = dstAlpha ?? dstRGB;
		this.equationRGB = equationRGB;
		this.equationAlpha = equationAlpha ?? equationRGB;
		this.enableBlend = true;
		return this;
	} /**
	 * 设置为标准颜色混合（保留目标透明度）
	 * - RGB: 标准半透明颜色混合（SRC_ALPHA, ONE_MINUS_SRC_ALPHA）
	 * - Alpha: 完全保留目标 Alpha，忽略源 Alpha
	 * 适用场景：半透明文字、UI 图标、贴花（只改颜色不改透明）
	 * @returns {this}
	 */
	setNormalColorOnly() {
		return this.setBlendState(
			GlBlendParamTypeEnum.SRC_ALPHA,
			GlBlendParamTypeEnum.ONE_MINUS_SRC_ALPHA,
			GlBlendParamTypeEnum.ZERO,
			GlBlendParamTypeEnum.ONE,
		);
	}
	/**
	 * 设置为预乘颜色混合（保留目标透明度）
	 * - RGB: 颜色按预乘方式叠加
	 * - Alpha: 完全保留目标 Alpha，忽略源 Alpha
	 * 适用场景：发光粒子、UI 叠加、只改颜色不改透明
	 * @returns {this}
	 */
	setPremultipliedColorOnly() {
		return this.setBlendState(
			GlBlendParamTypeEnum.ONE,
			GlBlendParamTypeEnum.ONE_MINUS_SRC_ALPHA,
			GlBlendParamTypeEnum.ZERO,
			GlBlendParamTypeEnum.ONE,
		);
	}

	/**
	 * @param {number} timestamp
	 */
	updateTween(timestamp) {
		this.tweenManager.update(timestamp, this);
		return this;
	}

	/**
	 * @param {string} tweenName
	 */
	startTween(tweenName) {
		this.tweenManager.start(tweenName, this);
		return this;
	}

	pauseTween() {
		this.tweenManager.pause();
		return this;
	}

	resumeTween() {
		this.tweenManager.resume();
		return this;
	}

	/**
	 * @param {string} tweenName
	 * @param {JavaScriptUtilsType.TweenConfig} tweenConfig
	 */
	setTween(tweenName, tweenConfig) {
		this.tweenManager.setTween(tweenName, tweenConfig);
		return this;
	}

	// ===== 节点树操作 =====

	/**
	 * @param {RenderNode} renderNode
	 */
	add(renderNode) {
		if (!this.children.includes(renderNode)) {
			if (renderNode.parent) {
				renderNode.parent.remove(renderNode);
			}
			renderNode.parent = this;
			this.children.push(renderNode);

			this.worldMatrixNeedUpdate = true;

			this.afterAddChild();
		}
		return this;
	}

	afterAddChild() {}

	/**
	 * @param {RenderNode} renderNode
	 */
	remove(renderNode) {
		const index = this.children.indexOf(renderNode);
		if (index !== -1) {
			renderNode.parent = null;
			this.children.splice(index, 1);

			this.afterRemoveChild();
		}
		return this;
	}

	afterRemoveChild() {}

	sortChildren() {
		this.children.sort(sortChildren);
	}

	destroy() {
		for (let i = this.children.length - 1; i >= 0; i--) {
			this.children[i].destroy();
		}
		if (this.parent) {
			this.parent.remove(this);
		}

		super.destroy();
	}
}
