import { BaseCleanUp } from "../../../../../../../javascript_utils/javascript_utils.js";

export class GlLocation extends BaseCleanUp {
	/** @type {CanvasEngineType.GlDataTypeEnum} */
	type;
	/** @type {string} */
	locationName;

	/**
	 * @param {CanvasEngineType.GlLocationFormat} glLocationFormat
	 */
	constructor(glLocationFormat) {
		super();

		this.type = glLocationFormat.type;
		this.locationName = glLocationFormat.name;
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} _gl
	 * @param {WebGLProgram} _program
	 */
	initGlLocation(_gl, _program) {
		throw new Error("GlLocation 子类未实现 initGlLocation 方法");
	}
}
