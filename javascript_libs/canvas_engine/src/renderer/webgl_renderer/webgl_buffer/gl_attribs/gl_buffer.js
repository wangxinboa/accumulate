import { BaseCleanUp } from "../../../../../../javascript_utils/javascript_utils.js";

export class GlBuffer extends BaseCleanUp {
	/** @type {WebGLBuffer | null} */
	buffer;
	/** @type {CanvasEngineType.GlBufferFormat['key']} */
	key;
	/** @type {CanvasEngineType.GlBufferFormat['target']} */
	target;
	/** @type {CanvasEngineType.GlBufferFormat['data']} */
	data;
	/** @type {CanvasEngineType.GlBufferFormat['usage']} */
	usage;

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
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 */
	bufferData(gl) {
		this.buffer = gl.createBuffer();
		gl.bindBuffer(gl[this.target], this.buffer);
		gl.bufferData(gl[this.target], this.data, gl[this.usage]);
		gl.bindBuffer(gl[this.target], null);

		return this;
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 */
	bindBuffer(gl) {
		gl.bindBuffer(gl[this.target], this.buffer);
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
