import "../../../../../src/rendering/batcher/shared/DefaultBatcher.mjs";

import { Batcher } from "./Batcher.ts";
import { BatchGeometry } from "./BatchGeometry.ts";
import { DefaultShader } from "./DefaultShader.ts";

export declare class DefaultBatcher extends Batcher {
	geometry: BatchGeometry;
	shader: DefaultShader;

	name: number;
	vertexSize: 6;
}
