import "../../../../../src/rendering/batcher/shared/BatchTextureArray.mjs";

import { TextureSource } from "../../../texture/source/TextureSource.ts";

export declare class BatchTextureArray {
	ids: Record<number, number>;
	textures: TextureSource[];
	count: number;
	constructor();
	clear(): void;
}
