import { BaseCleanUp } from "../../../../../javascript_utils/javascript_utils.js";
import { GlBlendParamTypeEnum, GlBlendEquationTypeEnum } from "./webgl_state_constants.js";

/**
 * WebGL 状态管理系统
 * 负责管理混合模式、深度测试、剔除等渲染状态。
 * 当前主要实现混合状态的缓存与设置。
 */
export class WebGLStateSystem extends BaseCleanUp {
	/** @type {CanvasEngineType.WebGLRenderer} */
	renderer;

	// ===== 缓存当前 GL 状态 =====
	/** @private @type {boolean | undefined} */
	_currentEnableBlend;
	/** @private @type {CanvasEngineType.GlBlendParamTypeEnum | undefined} */
	_currentSrcRGB;
	/** @private @type {CanvasEngineType.GlBlendParamTypeEnum | undefined} */
	_currentDstRGB;
	/** @private @type {CanvasEngineType.GlBlendParamTypeEnum | undefined} */
	_currentSrcAlpha;
	/** @private @type {CanvasEngineType.GlBlendParamTypeEnum| undefined} */
	_currentDstAlpha;
	/** @private @type {CanvasEngineType.GlBlendEquationTypeEnum| undefined} */
	_currentEquationRGB;
	/** @private @type {CanvasEngineType.GlBlendEquationTypeEnum | undefined} */
	_currentEquationAlpha;
	/**
	 * @param {CanvasEngineType.WebGLRenderer} renderer
	 */
	constructor(renderer) {
		super();
		this.renderer = renderer;
	}

	/**
	 * 根据渲染节点设置混合状态
	 * @param {CanvasEngineType.RenderNode} renderNode
	 * @returns {this}
	 */
	setState(renderNode) {
		this.setBlendState(
			this.renderer.gl,
			renderNode.enableBlend,
			renderNode.srcRGB,
			renderNode.dstRGB,
			renderNode.srcAlpha,
			renderNode.dstAlpha,
			renderNode.equationRGB,
			renderNode.equationAlpha,
		);
		return this;
	}

	/**
	 * 根据渲染节点设置混合状态
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {boolean} enableBlend
	 * @param {CanvasEngineType.GlBlendParamTypeEnum} srcRGB
	 * @param {CanvasEngineType.GlBlendParamTypeEnum} dstRGB
	 * @param {CanvasEngineType.GlBlendParamTypeEnum} srcAlpha
	 * @param {CanvasEngineType.GlBlendParamTypeEnum} dstAlpha
	 * @param {CanvasEngineType.GlBlendEquationTypeEnum} equationRGB
	 * @param {CanvasEngineType.GlBlendEquationTypeEnum} equationAlpha
	 * @returns {this}
	 */
	setBlendState(
		gl,
		enableBlend,
		srcRGB,
		dstRGB,
		srcAlpha,
		dstAlpha,
		equationRGB = GlBlendEquationTypeEnum.FUNC_ADD,
		equationAlpha = equationRGB,
	) {
		// 1. 处理混合开关
		if (enableBlend !== this._currentEnableBlend) {
			this._currentEnableBlend = enableBlend;
			if (enableBlend) {
				gl.enable(gl.BLEND);
			} else {
				gl.disable(gl.BLEND);
				return this;
			}
		}

		// 2. 处理混合因子（使用 blendFuncSeparate）
		if (
			srcRGB !== this._currentSrcRGB ||
			dstRGB !== this._currentDstRGB ||
			srcAlpha !== this._currentSrcAlpha ||
			dstAlpha !== this._currentDstAlpha
		) {
			gl.blendFuncSeparate(
				gl[GlBlendParamTypeEnum[srcRGB]],
				gl[GlBlendParamTypeEnum[dstRGB]],
				gl[GlBlendParamTypeEnum[srcAlpha]],
				gl[GlBlendParamTypeEnum[dstAlpha]],
			);
			this._currentSrcRGB = srcRGB;
			this._currentDstRGB = dstRGB;
			this._currentSrcAlpha = srcAlpha;
			this._currentDstAlpha = dstAlpha;
		}

		// 3. 处理混合方程（使用 blendEquationSeparate）
		if (equationRGB !== this._currentEquationRGB || equationAlpha !== this._currentEquationAlpha) {
			gl.blendEquationSeparate(gl[GlBlendEquationTypeEnum[equationRGB]], gl[GlBlendEquationTypeEnum[equationAlpha]]);
			this._currentEquationRGB = equationRGB;
			this._currentEquationAlpha = equationAlpha;
		}

		return this;
	}

	/**
	 * 重置所有状态为默认值（标准透明混合）
	 * @returns {this}
	 */
	resetState() {
		this.setBlendState(
			this.renderer.gl,
			this._currentEnableBlend ?? false,
			this._currentSrcRGB ?? GlBlendParamTypeEnum.SRC_ALPHA,
			this._currentDstRGB ?? GlBlendParamTypeEnum.ONE_MINUS_SRC_ALPHA,
			this._currentSrcAlpha ?? GlBlendParamTypeEnum.SRC_ALPHA,
			this._currentDstAlpha ?? GlBlendParamTypeEnum.ONE_MINUS_SRC_ALPHA,
			this._currentEquationRGB,
			this._currentEquationAlpha,
		);
		return this;
	}

	/**
	 * 销毁时清理
	 */
	destroy() {
		super.destroy();
	}
}
