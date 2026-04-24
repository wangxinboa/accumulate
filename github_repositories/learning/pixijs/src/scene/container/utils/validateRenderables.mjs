"use strict";
/**
 * @param {PixijsType.RenderGroup} renderGroup
 * @param {PixijsType.AbstractRenderer['renderPipes']} renderPipes
 */
function validateRenderables(renderGroup, renderPipes) {
	const { list, index } = renderGroup.childrenRenderablesToUpdate;
	let rebuildRequired = false;
	for (let i = 0; i < index; i++) {
		const container = list[i];
		const renderable = container;
		// /** @type {PixijsType.CanvasTextPipe} */
		// /** @type {PixijsType.SpritePipe} */
		/** @type {PixijsType.CanvasTextPipe} */
		const pipe = renderPipes[renderable.renderPipeId];
		rebuildRequired = pipe.validateRenderable(container);
		if (rebuildRequired) {
			break;
		}
	}
	renderGroup.structureDidChange = rebuildRequired;
	return rebuildRequired;
}

export { validateRenderables };
//# sourceMappingURL=validateRenderables.mjs.map
