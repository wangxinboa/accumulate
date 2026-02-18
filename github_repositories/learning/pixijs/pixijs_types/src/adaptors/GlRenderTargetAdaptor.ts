import "../../../src/rendering/renderers/gl/renderTarget/GlRenderTargetAdaptor.mjs";

import { Rectangle } from "../../../src/maths/shapes/Rectangle.mjs";
import { RenderTargetSystem } from "../rendering/renderers/shared/renderTarget/RenderTargetSystem.ts";

export declare class GlRenderTargetAdaptor {
	_renderTargetSystem: RenderTargetSystem;

	_viewPortCache: Rectangle;
}
