import { GlLocation } from "./gl_location.js";

export class UniformLocation extends GlLocation {
	/** @type {WebGLUniformLocation | null} */
	uniformLocation;
	/**
	 * @param {CanvasEngineType.GlUniformLocationFormat} glUniformLocationFormat
	 */
	constructor(glUniformLocationFormat) {
		super(glUniformLocationFormat);

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
