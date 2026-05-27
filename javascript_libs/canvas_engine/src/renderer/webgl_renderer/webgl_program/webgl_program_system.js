import { BaseCleanUp, CustomMap } from "../../../../../javascript_utils/javascript_utils.js";
import { GlProgram } from "./gl_program/gl_program.js";

export class WebGLProgramSystem extends BaseCleanUp {
	/** @type {CanvasEngineType.WebGLRenderer} */
	renderer;
	/** @type {CanvasEngineType.GlProgram | null} */
	activeGlProgram;
	/** @private @type {CustomMap<CanvasEngineType.GlProgram>} */
	_cacheGlPrograms;
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
	useProgramByRenderNode(renderNode) {
		const glProgram = renderNode.getGlProgram(this);

		if (this.activeGlProgram !== glProgram) {
			glProgram.use(this.renderer.gl);
			this.activeGlProgram = glProgram;
		}

		return glProgram;
	}
	deleteAllPrograms() {
		this.activeGlProgram = null;

		for (let i = 0, len = this._cacheGlPrograms.array.length; i < len; i++) {
			this._cacheGlPrograms.array[i].delete(this.renderer.gl);
		}
	}
	resetAllPrograms() {
		this.activeGlProgram = null;

		for (let i = 0, len = this._cacheGlPrograms.array.length; i < len; i++) {
			this._cacheGlPrograms.array[i].reset(this.renderer.gl);
		}
	}
}
