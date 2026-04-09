import { BaseCleanUp } from "../../../../../javascript_utils/javascript_utils.js";
import { GlAttribs } from "./gl_attribs/gl_attribs.js";
import { GlBuffer } from "./gl_attribs/gl_buffer.js";

export class WebGLBufferSystem extends BaseCleanUp {
	/** @type {CanvasEngineType.WebGLRenderer} */
	renderer;
	/** @type {Record<string, GlBuffer>} */
	_cacheGlBuffers;
	/** @type {Record<CanvasEngineType.AllRenderNode["id"], GlAttribs>} */
	_cacheGlAttribs;
	/** @type {GlBuffer | null} */
	activeBuffer;
	/**
	 * @param {CanvasEngineType.WebGLRenderer} renderer
	 */
	constructor(renderer) {
		super();

		this.renderer = renderer;

		this._cacheGlBuffers = {};
		this._cacheGlAttribs = {};

		this.activeBuffer = null;
	}
	/**
	 * @param {CanvasEngineType.WebGLPipe} webglPipe
	 * @param {CanvasEngineType.AllRenderNode} renderNode
	 * @param {CanvasEngineType.GlProgram} glProgram
	 */
	bindBuffersByRenderNode(webglPipe, renderNode, glProgram) {
		// initCacheGlBuffers
		const buffersFormat = webglPipe.getBuffersFormat(renderNode);

		for (let i = 0, len = buffersFormat.length; i < len; i++) {
			const bufferFormat = buffersFormat[i];

			if (!(this._cacheGlBuffers[bufferFormat.key] instanceof GlBuffer)) {
				this._cacheGlBuffers[bufferFormat.key] = new GlBuffer(bufferFormat).bufferData(this.renderer.gl);
			}
		}
		// initCacheGlAttribs
		const attribsFormat = webglPipe.getAttribsFormat(renderNode);

		let glAttribs = this._cacheGlAttribs[renderNode.id];
		if (!(this._cacheGlAttribs[renderNode.id] instanceof GlAttribs)) {
			glAttribs = this._cacheGlAttribs[renderNode.id] = new GlAttribs(attribsFormat);
		}

		for (let i = 0, len = glAttribs.arrtibNames.length; i < len; i++) {
			const glAttrib = glAttribs.arrtibs[glAttribs.arrtibNames[i]];
			const glAttribBuffer = this._cacheGlBuffers[glAttrib.bufferKey];

			if (this.activeBuffer !== glAttribBuffer) {
				this.activeBuffer = glAttribBuffer;
				this.activeBuffer.bindBuffer(this.renderer.gl);
			}

			glAttrib.vertexAttribPointer(this.renderer.gl, glProgram);
		}
	}
}
