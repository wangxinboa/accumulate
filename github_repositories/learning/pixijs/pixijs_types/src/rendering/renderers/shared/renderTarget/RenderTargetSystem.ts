import "../../../../../../src/rendering/renderers/shared/renderTarget/RenderTargetSystem.mjs";

import { Rectangle } from "../../../../../../src/maths/shapes/Rectangle.mjs";
import { Matrix } from "../../../../../../src/maths/matrix/Matrix.mjs";
import { GlRenderTargetAdaptor } from "../../../../adaptors/GlRenderTargetAdaptor.ts";
import { RenderTarget } from "../../../../texture/RenderTarget.ts";

export declare class RenderTargetSystem {
	adaptor: GlRenderTargetAdaptor;

	rootViewPort: Rectangle;
	viewport: Rectangle;

	_renderTargetStack: Array<{
		renderTarget: RenderTarget;
		frame?: Rectangle;
	}>;
	renderTarget: RenderTarget;
	renderSurface: RenderTarget;
	projectionMatrix: Matrix;

	rootRenderTarget: RenderTarget;
	renderingToScreen?: boolean;
}
