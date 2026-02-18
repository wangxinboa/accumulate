import {
	compileHighShaderGlProgram,
	// compileHighShaderGpuProgram,
} from "../../high-shader/compileHighShaderToProgram.js";
import { colorBitGl } from "../../high-shader/shader-bits/colorBit.js";
import {
	generateTextureBatchBitGl,
	// generateTextureBatchBit,
} from "../../high-shader/shader-bits/generateTextureBatchBit.js";
import { roundPixelsBitGl } from "../../high-shader/shader-bits/roundPixelsBit.js";
import { getBatchSamplersUniformGroup } from "../../renderers/gl/shader/getBatchSamplersUniformGroup.js";
import { Shader } from "../../renderers/shared/shader/Shader.js";

export class DefaultShader extends Shader {
	constructor(maxTextures) {
		const glProgram = compileHighShaderGlProgram({
			name: "batch",
			bits: [colorBitGl, generateTextureBatchBitGl(maxTextures), roundPixelsBitGl],
		});
		// const gpuProgram = compileHighShaderGpuProgram({
		// 	name: "batch",
		// 	bits: [colorBit, generateTextureBatchBit(maxTextures), roundPixelsBit],
		// });
		super({
			glProgram,
			// gpuProgram,
			resources: {
				batchSamplers: getBatchSamplersUniformGroup(maxTextures),
			},
		});
	}
}
