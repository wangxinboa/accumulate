"use strict";
/**
 *
 * @param {PixijsType.RenderGroup} renderGroup
 * @param {PixijsType.WebGLRendererRenderPipes} renderer
 */
function executeInstructions(renderGroup, renderer) {
	const instructionSet = renderGroup.instructionSet;
	const instructions = instructionSet.instructions;
	for (let i = 0; i < instructionSet.instructionSize; i++) {
		const instruction = instructions[i];
		/** @type {PixijsType.BatcherPipe} */ (renderer[instruction.renderPipeId]).execute(instruction);
	}
}

export { executeInstructions };
//# sourceMappingURL=executeInstructions.mjs.map
