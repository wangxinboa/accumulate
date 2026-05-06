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
	 * @param {CanvasEngineType.AllRenderNode} renderNode
	 * @param {CanvasEngineType.GlProgram} glProgram
	 */
	bindBuffersByRenderNode(renderNode, glProgram) {
		// initBuffers
		renderNode.initBuffers(this.renderer.gl, this._cacheGlBuffers);
		// getAttribs
		const glAttribs = renderNode.getAttribs(this._cacheGlAttribs);

		// vertexAttribPointer
		for (let i = 0, len = glAttribs.arrtibNames.length; i < len; i++) {
			const glAttrib = glAttribs.arrtibs[glAttribs.arrtibNames[i]];
			const glAttribBuffer = this._cacheGlBuffers.get(glAttrib.bufferKey);

			if (glAttribBuffer instanceof GlBuffer) {
				if (this._activeBuffer !== glAttribBuffer) {
					this._activeBuffer = glAttribBuffer;
					this._activeBuffer.bindBuffer(this.renderer.gl);
				}

				glAttrib.vertexAttribPointer(this.renderer.gl, glProgram);
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
