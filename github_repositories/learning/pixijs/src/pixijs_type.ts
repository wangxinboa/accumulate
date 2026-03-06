import { WebGPURenderer as WebGPURendererClass } from "./rendering/renderers/gpu/WebGPURenderer.mjs";
import { WebGLRenderer as WebGLRendererClass } from "./rendering/renderers/gl/WebGLRenderer.mjs";

declare global {
	namespace PixijsType {
		type WebGPURenderer = WebGPURendererClass;
		type WebGLRenderer = WebGLRendererClass;
		type Renderer = WebGPURenderer | WebGLRenderer;
	}
}

export { PixijsType };
