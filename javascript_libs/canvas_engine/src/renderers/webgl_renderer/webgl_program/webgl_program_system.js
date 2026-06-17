import { BaseCleanUp, CustomMap } from "../../../../../javascript_utils/javascript_utils.js";
import { GlProgram } from "./gl_program/gl_program.js";

export class WebGLProgramSystem extends BaseCleanUp {
	/** @type {CanvasEngineType.WebGLRenderer} */
	renderer;
	/** @type {CanvasEngineType.GlProgram | null} */
	activeGlProgram;
	/** @private @type {CustomMap<CanvasEngineType.GlProgram>} */
	_cacheGlPrograms;
	/** @type {boolean} */
	programHasChange = true;
	/**
	 * @param {CanvasEngineType.WebGLRenderer} renderer
	 */
	constructor(renderer) {
		super();

		this.renderer = renderer;
		this.activeGlProgram = null;
		this._cacheGlPrograms = new CustomMap();
	}
	/**
	 * @param {string} glProgramKey
	 * @param {CanvasEngineType.GlProgramFormat} glProgramFormat
	 */
	addGlProgram(glProgramKey, glProgramFormat) {
		if (!this._cacheGlPrograms.has(glProgramKey)) {
			this._cacheGlPrograms.set(glProgramKey, new GlProgram(this.renderer.gl, glProgramFormat));
		}
		return this._cacheGlPrograms.get(glProgramKey);
	}
	/**
	 * @param {CanvasEngineType.AllRenderNode} renderNode
	 */
	useProgram(renderNode) {
		const glProgram = renderNode.getGlProgram(this);

		this.programHasChange = this.activeGlProgram !== glProgram;
		if (this.programHasChange) {
			glProgram.use(this.renderer.gl);
			this.activeGlProgram = glProgram;
		}

		return glProgram;
	}
	deleteGlPrograms() {
		this.activeGlProgram = null;

		for (let i = 0, len = this._cacheGlPrograms.array.length; i < len; i++) {
			this._cacheGlPrograms.array[i].delete(this.renderer.gl);
		}
	}
	resetGlPrograms() {
		this.activeGlProgram = null;

		for (let i = 0, len = this._cacheGlPrograms.array.length; i < len; i++) {
			this._cacheGlPrograms.array[i].reset(this.renderer.gl);
		}
	}
	destroy() {
		for (let i = 0, len = this._cacheGlPrograms.array.length; i < len; i++) {
			this._cacheGlPrograms.array[i].destroy();
		}
		this._cacheGlPrograms.destroy();

		super.destroy();
	}
}
