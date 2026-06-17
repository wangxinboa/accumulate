import { BaseCleanUp } from "../../../../../../javascript_utils/javascript_utils.js";

export class GlBuffer extends BaseCleanUp {
	/** @type {CanvasEngineType.GlBufferFormat['key']} */
	key;
	/** @type {CanvasEngineType.GlBufferFormat['target']} */
	target;
	/** @type {CanvasEngineType.GlBufferFormat['data']} */
	data;
	/** @type {CanvasEngineType.GlBufferFormat['usage']} */
	usage;
	/** @type {WebGLBuffer | null} */
	buffer;
	/** @type {boolean} */
	dataHasChange;
	/**
	 * @param {CanvasEngineType.GlBufferFormat['key']} key
	 * @param {CanvasEngineType.GlBufferFormat['target']} target
	 * @param {CanvasEngineType.GlBufferFormat['data']} data
	 * @param {CanvasEngineType.GlBufferFormat['usage']} usage
	 */
	constructor(key, target, data, usage) {
		super();

		this.key = key;
		this.target = target;
		this.data = data;
		this.usage = usage;

		this.buffer = null;

		this.dataHasChange = false;
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 */
	bufferData(gl) {
		this.buffer = gl.createBuffer();

		gl.bindBuffer(gl[this.target], this.buffer);
		gl.bufferData(gl[this.target], this.data, gl[this.usage]);
		gl.bindBuffer(gl[this.target], null);

		this.dataHasChange = true;

		return this;
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {number} dstByteOffset
	 * @param {CanvasEngineType.GlBufferFormat['data']} data
	 */
	updateBufferSubData(gl, dstByteOffset, data) {
		this.data = data;

		gl.bindBuffer(gl[this.target], this.buffer);
		gl.bufferSubData(gl[this.target], dstByteOffset, this.data);
		gl.bindBuffer(gl[this.target], null);

		this.dataHasChange = true;

		return this;
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 */
	bindBuffer(gl) {
		gl.bindBuffer(gl[this.target], this.buffer);

		this.dataHasChange = false;
		return this;
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 */
	unbindBuffer(gl) {
		gl.bindBuffer(gl[this.target], null);
		return this;
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 */
	deleteBuffer(gl) {
		gl.deleteBuffer(this.buffer);
		return this;
	}
}
