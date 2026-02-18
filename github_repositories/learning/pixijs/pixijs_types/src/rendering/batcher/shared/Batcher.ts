import "../../../../../src/rendering/batcher/shared/Batcher.mjs";

import { ViewableBuffer } from "../../../../../src/utils/data/ViewableBuffer.mjs";

import { BatchableSprite } from "../../../scene/sprite/BatchableSprite.ts";
import { IndexBufferArray } from "../../renderers/shared/geometry/Geometry.ts";
import { BatchTextureArray } from "./BatchTextureArray.ts";

export declare class Batch {
	start: number;
	size: number;

	textures: BatchTextureArray;
}

export declare class Batcher {
	attributeBuffer: ViewableBuffer;
	indexBuffer: IndexBufferArray;
	maxTextures?: number;

	_elements: Array<BatchableSprite>;
	elementSize: number;
	elementStart: number;
	indexSize: number;
	attributeSize: number;

	batches: Batch[];
	batchIndex: number;
	_batchIndexStart: number;
	_batchIndexSize: number;
	dirty: boolean;
}
