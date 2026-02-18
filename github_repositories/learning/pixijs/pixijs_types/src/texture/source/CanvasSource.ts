import "../../../../src/rendering/renderers/shared/texture/sources/CanvasSource.mjs";

import { TextureSource } from "./TextureSource.ts";

export declare class CanvasSource extends TextureSource {
	autoDensity?: boolean;
	transparent?: boolean;

	resizeCanvas(): void;
	resize(width?: number, height?: number, resolution?: number): boolean;
}
