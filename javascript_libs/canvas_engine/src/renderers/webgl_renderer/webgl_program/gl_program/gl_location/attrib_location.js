import { GlLocation } from "./gl_location.js";

export class AttribLocation extends GlLocation {
	/**
	 * @param {CanvasEngineType.GlAttribLocationFormat} glAttribLocationFormat
	 */
	constructor(glAttribLocationFormat) {
		super(glAttribLocationFormat);

		this.attribLocation = -1;
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {WebGLProgram} program
	 * @returns {AttribLocation}
	 */
	initGlLocation(gl, program) {
		this.attribLocation = gl.getAttribLocation(program, this.locationName);
		return this;
	}
}
