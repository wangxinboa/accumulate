import { Sprite2D } from "../../../render_node/2d/sprite2d/sprite2d.js";
import { Sprite2DWebGLPipe } from "../../../render_node/2d/sprite2d/sprite2d_webgl_pipe.js";

/**
 * @param {CanvasEngineType.AllRenderNode} renderNode
 * @returns {CanvasEngineType.WebGLPipe}
 */
export function getWebGLPipeByRenderNode(renderNode) {
	if (renderNode instanceof Sprite2D) {
		return Sprite2DWebGLPipe;
	} else {
		console.error(renderNode);
		throw new Error("renderNode 类型没有对应的 buffer 可以获取");
	}
}
