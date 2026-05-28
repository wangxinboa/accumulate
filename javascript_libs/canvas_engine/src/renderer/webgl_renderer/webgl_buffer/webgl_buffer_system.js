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
	 * @param {CanvasEngineType.GlBufferFormat['key']} key
	 * @param {CanvasEngineType.GlBufferFormat['target']} target
	 * @param {CanvasEngineType.GlBufferFormat['data']} data
	 * @param {CanvasEngineType.GlBufferFormat['usage']} usage
	 */
	addBuffer(key, target, data, usage) {
		if (!this._cacheGlBuffers.has(key)) {
			this._cacheGlBuffers.set(key, new GlBuffer(key, target, data, usage).bufferData(this.renderer.gl));
		}
	}
	/**
	 * @param {string} attribsKey
	 */
	getAttribs(attribsKey) {
		return this._cacheGlAttribs.get(attribsKey);
	}
	/**
	 * @param {string} attribsKey
	 */
	hasAttribs(attribsKey) {
		return this._cacheGlAttribs.has(attribsKey);
	}
	/**
	 * @param {string} attribsKey
	 * @param {GlAttribs} glAttribs
	 */
	setAttribs(attribsKey, glAttribs) {
		this._cacheGlAttribs.set(attribsKey, glAttribs);
	}

	/**
	 * @param {CanvasEngineType.AllRenderNode} renderNode
	 * @param {CanvasEngineType.GlProgram} glProgram
	 */
	bindBuffersByRenderNode(renderNode, glProgram) {
		// addBuffers
		renderNode.addBuffers(this);
		// getAttribs
		const glAttribs = renderNode.getAttribs(this);

		// vertexAttribPointer
		if (glAttribs instanceof GlAttribs) {
			for (let i = 0, len = glAttribs.arrtibNames.length; i < len; i++) {
				const glAttrib = glAttribs.arrtibs[glAttribs.arrtibNames[i]];
				const glAttribBuffer = this._cacheGlBuffers.get(glAttrib.bufferKey);

				if (glAttribBuffer instanceof GlBuffer) {
					if (this._activeBuffer !== glAttribBuffer) {
						this._activeBuffer = glAttribBuffer;
						this._activeBuffer.bindBuffer(this.renderer.gl);
					}

					glProgram.enableVertexAttribArray(this.renderer.gl, glAttrib);
				}
			}
		}
	}
	resetAllBuffers() {
		for (let i = 0, len = this._cacheGlBuffers.array.length; i < len; i++) {
			this._cacheGlBuffers.array[i].bufferData(this.renderer.gl);
		}
	}
	deleteAllBuffers() {
		for (let i = 0, len = this._cacheGlBuffers.array.length; i < len; i++) {
			this._cacheGlBuffers.array[i].deleteBuffer(this.renderer.gl);
		}
	}
}
