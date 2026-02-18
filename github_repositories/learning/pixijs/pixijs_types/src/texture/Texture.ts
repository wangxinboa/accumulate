import "../../../src/rendering/renderers/shared/texture/Texture.mjs";

import { Rectangle } from "../../../src/maths/shapes/Rectangle.mjs";

import { CanvasSource } from "./source/CanvasSource.ts";
import { TextureSource } from "./source/TextureSource.ts";

export declare class Texture {
	frame: Rectangle;
	noFrame: boolean;
	uvs: {
		x0: number;
		y0: number;
		x1: number;
		y1: number;
		x2: number;
		y2: number;
		x3: number;
		y3: number;
	};

	source: TextureSource | CanvasSource;
	label?: string;
}
