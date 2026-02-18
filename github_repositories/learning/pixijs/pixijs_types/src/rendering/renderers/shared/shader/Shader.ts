import "../../../../../../src/rendering/renderers/shared/shader/Shader.mjs";

import { GlProgram } from "../../gl/shader/GlProgram.ts";
import { BindGroup } from "../../gpu/shader/BindGroup.ts";

export declare class Shader {
	glProgram: GlProgram;
	_ownedBindGroups: BindGroup[];
}
