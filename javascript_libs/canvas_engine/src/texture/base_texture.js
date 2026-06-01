import { BaseCleanUp } from "../../../javascript_utils/javascript_utils.js";
import { GlTextureParamTypeEnum } from "../renderer/webgl_renderer/webgl_texture/gl_texture_type.js";

export class BaseTexture extends BaseCleanUp {
	/** @type {boolean} */
	isBaseTexture;

	/** @type {keyof typeof GlTextureParamTypeEnum} */
	wrapS;
	/** @type {keyof typeof GlTextureParamTypeEnum} */
	wrapT;
	/** @type {keyof typeof GlTextureParamTypeEnum} */
	minFilter;
	/** @type {keyof typeof GlTextureParamTypeEnum} */
	magFilter;
	/** @type {boolean} */
	unpackFlipY;

	constructor() {
		super();

		this.isBaseTexture = true;

		this.wrapS = GlTextureParamTypeEnum.CLAMP_TO_EDGE;
		this.wrapT = GlTextureParamTypeEnum.CLAMP_TO_EDGE;

		this.minFilter = GlTextureParamTypeEnum.LINEAR;
		this.magFilter = GlTextureParamTypeEnum.LINEAR;
		this.unpackFlipY = true;
	}
}
