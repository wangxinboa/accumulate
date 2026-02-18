import "../../../../src/rendering/renderers/shared/texture/sources/TextureSource.mjs";

import { TextureStyle } from "./TextureStyle.ts";

export declare class TextureSource {
	pixelWidth?: number;
	pixelHeight?: number;
	width: number;
	height: number;
	resource?: any;

	sampleCount?: number;
	mipLevelCount: number;

	antialias: boolean;

	isPowerOfTwo: boolean;

	style: TextureStyle;

	resolution?: number;
	resize(width?: number, height?: number, resolution?: number): boolean;
}
