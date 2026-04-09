import { GlLocation } from "./gl_location.js";

export class UniformLocation extends GlLocation {
	/** @type {boolean} */
	isGlobal;
	/** @type {boolean} */
	isTexture;
	/** @type {WebGLUniformLocation | null} */
	uniformLocation;
	/**
	 * @param {CanvasEngineType.GlUniformLocationFormat} glUniformLocationFormat
	 */
	constructor(glUniformLocationFormat) {
		super(glUniformLocationFormat);

		this.isGlobal = glUniformLocationFormat.isGlobal ?? false;
		this.isTexture = glUniformLocationFormat.isTexture ?? false;
		this.uniformLocation = null;
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {WebGLProgram} program
	 * @returns {UniformLocation}
	 */
	initGlLocation(gl, program) {
		this.uniformLocation = gl.getUniformLocation(program, this.locationName);
		return this;
	}
}
