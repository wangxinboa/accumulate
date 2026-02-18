import "../../../src/rendering/renderers/shared/renderTarget/RenderTarget.mjs";

import { TextureSource } from "./source/TextureSource.ts";

export declare class RenderTarget {
	// new Float32Array([this.pixelWidth,this.pixelHeight])
	_size: Float32Array;
	colorTextures: TextureSource[];
	depthStencilTexture: TextureSource;
	isRoot: boolean;
	// this.colorTexture.source.pixelWidth;
	pixelWidth: number;
	// this.colorTexture.source.pixelHeight;
	pixelHeight: number;

	resize(width: number, height: number, resolution?: number, skipColorTexture?: boolean): void;
}
