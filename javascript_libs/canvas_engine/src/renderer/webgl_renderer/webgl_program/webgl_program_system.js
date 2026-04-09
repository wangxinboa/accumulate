import { BaseCleanUp } from "../../../../../javascript_utils/javascript_utils.js";
import { GlProgram } from "./gl_program/gl_program.js";

export class WebGLProgramSystem extends BaseCleanUp {
	/** @type {CanvasEngineType.WebGLRenderer} */
	renderer;
	/** @type {CanvasEngineType.GlProgram | null} */
	activeGlProgram;
	/** @private @type {Record<string, CanvasEngineType.GlProgram>} */
	_cacheGlPrograms;
	/**
	 * @param {CanvasEngineType.WebGLRenderer} renderer
	 */
	constructor(renderer) {
		super();

		this.renderer = renderer;
		this.activeGlProgram = null;
		this._cacheGlPrograms = {};
	}
	/**
	 * @param {CanvasEngineType.WebGLPipe} webglPipe
	 * @param {CanvasEngineType.AllRenderNode} renderNode
	 */
	useProgramByRenderNode(webglPipe, renderNode) {
		const glProgramKey = webglPipe.getProgramKey();

		if (!(this._cacheGlPrograms[glProgramKey] instanceof GlProgram)) {
			this._cacheGlPrograms[glProgramKey] = new GlProgram(
				this.renderer.gl,
				webglPipe.getShaderSource(renderNode),
			).initLocations(
				this.renderer.gl,
				webglPipe.getUniformLocationsFormat(renderNode),
				webglPipe.getAttribLocationsFormat(renderNode),
			);
		}

		const glProgram = this._cacheGlPrograms[glProgramKey];

		if (this.activeGlProgram !== glProgram) {
			glProgram.use(this.renderer.gl);
			this.activeGlProgram = glProgram;
		}

		return glProgram;
	}
}
