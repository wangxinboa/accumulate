import { BaseCleanUp, CustomMap } from "../../../../../javascript_utils/javascript_utils.js";

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
	 * @param {CanvasEngineType.AllRenderNode} renderNode
	 */
	useProgramByRenderNode(renderNode) {
		const glProgram = renderNode.getGlProgram(this.renderer.gl, this._cacheGlPrograms);

		if (this.activeGlProgram !== glProgram) {
			glProgram.use(this.renderer.gl);
			this.activeGlProgram = glProgram;
		}

		return glProgram;
	}
}
