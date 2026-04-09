import { BaseCleanUp } from "../../../../../../javascript_utils/javascript_utils.js";

export class GlAttrib extends BaseCleanUp {
	/** @type {CanvasEngineType.GlAttribFormat["bufferKey"]} */
	bufferKey;
	/** @type {CanvasEngineType.GlAttribFormat["attribName"]} */
	attribName;
	/** @type {CanvasEngineType.GlAttribFormat["size"]} */
	size;
	/** @type {CanvasEngineType.GlAttribFormat["type"]} */
	type;
	/** @type {CanvasEngineType.GlAttribFormat["normalized"]} */
	normalized;
	/** @type {CanvasEngineType.GlAttribFormat["stride"]} */
	stride;
	/** @type {CanvasEngineType.GlAttribFormat["offset"]} */
	offset;
	/**
	 * @param {CanvasEngineType.GlAttribFormat} glAttribFormat
	 */
	constructor(glAttribFormat) {
		super();

		this.bufferKey = glAttribFormat.bufferKey;
		this.attribName = glAttribFormat.attribName;
		this.size = glAttribFormat.size;
		this.type = glAttribFormat.type;
		this.normalized = glAttribFormat.normalized;
		this.stride = glAttribFormat.stride;
		this.offset = glAttribFormat.offset;
	}

	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.GlProgram} glProgram
	 */
	vertexAttribPointer(gl, glProgram) {
		const loaction = glProgram.getAttribLocation(this.attribName);
		gl.vertexAttribPointer(loaction, this.size, gl[this.type], this.normalized, this.stride, this.offset);
		gl.enableVertexAttribArray(loaction);
	}
}
