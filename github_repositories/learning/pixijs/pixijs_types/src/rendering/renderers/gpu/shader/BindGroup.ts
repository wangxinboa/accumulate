import "../../../../../../src/rendering/renderers/gpu/shader/BindGroup.mjs";

import { UniformGroup } from "../../shared/shader/UniformGroup.ts";

export declare class BindGroup {
	resources: Record<string, UniformGroup>;
	_dirty: boolean;
}
