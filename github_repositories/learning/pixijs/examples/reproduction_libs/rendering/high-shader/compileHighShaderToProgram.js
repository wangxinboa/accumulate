import { GlProgram } from "../renderers/gl/shader/GlProgram.js";
import { compileHighShaderGl } from "./compiler/compileHighShader.js";
import { vertexGlTemplate, fragmentGlTemplate } from "./defaultProgramTemplate.js";
import { globalUniformsBitGl } from "./shader-bits/globalUniformsBit.js";

function compileHighShaderGlProgram({ bits, name }) {
	return new GlProgram({
		name,
		...compileHighShaderGl({
			template: {
				vertex: vertexGlTemplate,
				fragment: fragmentGlTemplate,
			},
			bits: [globalUniformsBitGl, ...bits],
		}),
	});
}

export { compileHighShaderGlProgram };
