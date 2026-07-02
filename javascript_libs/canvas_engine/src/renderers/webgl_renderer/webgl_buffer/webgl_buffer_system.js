import { BaseCleanUp, CustomMap } from "../../../../../javascript_utils/javascript_utils.js";
import { GlAttribs } from "./gl_attribs/gl_attribs.js";
import { GlBuffer } from "./gl_attribs/gl_buffer.js";

export class WebGLBufferSystem extends BaseCleanUp {
	/** @type {CanvasEngineType.WebGLRenderer} */
	renderer;
	/** @type {CustomMap<GlBuffer>} */
	_cacheGlBuffers;
	/** @type {CustomMap<GlAttribs>} */
	_cacheGlAttribs;
	/** @type {GlBuffer | null} */
	_activeBuffer;
	/**
	 * @param {CanvasEngineType.WebGLRenderer} renderer
	 */
	constructor(renderer) {
		super();

		this.renderer = renderer;

		this._cacheGlBuffers = new CustomMap();
		this._cacheGlAttribs = new CustomMap();

		this._activeBuffer = null;
	}
	/**
	 * @param {string} attribsKey
	 */
	getGlAttribs(attribsKey) {
		return this._cacheGlAttribs.get(attribsKey);
	}
	/**
	 * @param {string} attribsKey
	 */
	hasGlAttribs(attribsKey) {
		return this._cacheGlAttribs.has(attribsKey);
	}
	/**
	 * @param {string} attribsKey
	 * @param {GlAttribs} glAttribs
	 */
	setGlAttribs(attribsKey, glAttribs) {
		this._cacheGlAttribs.set(attribsKey, glAttribs);
	}
	/**
	 * @param {string} bufferKey
	 */
	getGlBuffer(bufferKey) {
		return this._cacheGlBuffers.get(bufferKey);
	}
	/**
	 * @param {string} bufferKey
	 */
	hasGlBuffer(bufferKey) {
		return this._cacheGlBuffers.has(bufferKey);
	}
	/**
	 * @param {string} bufferKey
	 * @param {GlBuffer} glBuffer
	 */
	setGlBuffer(bufferKey, glBuffer) {
		this._cacheGlBuffers.set(bufferKey, glBuffer);
	}
	/**
	 * @param {CanvasEngineType.AllRenderNode} renderNode
	 * @param {CanvasEngineType.GlProgram} glProgram
	 */
	bindBuffers(renderNode, glProgram) {
		// 使用 renderNode.pipe 更新缓冲区
		renderNode.pipe.updateBuffers(renderNode, this.renderer.gl, this);
		// 使用 renderNode.pipe 获取属性配置
		const glAttribs = renderNode.pipe.updateAttribs(renderNode, this);

		// vertexAttribPointer
		if (glAttribs instanceof GlAttribs) {
			for (let i = 0, len = glAttribs.attribNames.length; i < len; i++) {
				const glAttrib = glAttribs.attribs[glAttribs.attribNames[i]];
				const glAttribBuffer = this._cacheGlBuffers.get(glAttrib.bufferKey);

				if (glAttribBuffer instanceof GlBuffer) {
					if (this._activeBuffer !== glAttribBuffer) {
						this._activeBuffer = glAttribBuffer;
						this._activeBuffer.bindBuffer(this.renderer.gl);
					} else if (this._activeBuffer.dataHasChange) {
						this._activeBuffer.bindBuffer(this.renderer.gl);
					}

					glProgram.enableVertexAttribArray(this.renderer.gl, glAttrib);
				}
			}
		}
	}
	resetGlBuffers() {
		for (let i = 0, len = this._cacheGlBuffers.array.length; i < len; i++) {
			this._cacheGlBuffers.array[i].bufferData(this.renderer.gl);
		}
	}
	deleteGlBuffers() {
		for (let i = 0, len = this._cacheGlBuffers.array.length; i < len; i++) {
			this._cacheGlBuffers.array[i].deleteBuffer(this.renderer.gl);
		}
	}
	destroy() {
		for (let i = 0, len = this._cacheGlBuffers.array.length; i < len; i++) {
			this._cacheGlBuffers.array[i].destroy();
		}
		this._cacheGlBuffers.destroy();

		for (let i = 0, len = this._cacheGlAttribs.array.length; i < len; i++) {
			this._cacheGlAttribs.array[i].destroy();
		}
		this._cacheGlAttribs.destroy();

		super.destroy();
	}
}
