import "../../../../../src/rendering/batcher/shared/BatcherPipe.mjs";

import { InstructionSet } from "../../renderers/shared/instructions/InstructionSet.ts";
import { GlBatchAdaptor } from "../gl/GlBatchAdaptor.ts";
import { DefaultBatcher } from "./DefaultBatcher.ts";

export declare class BatcherPipe {
	_batchersByInstructionSet: Record<InstructionSet["uid"], Record<string, DefaultBatcher>>;
	_activeBatches: Record<string, BatcherPipe["_activeBatch"]>;
	_activeBatch: DefaultBatcher;

	_adaptor: GlBatchAdaptor;
}
