import { Matrix } from "../../maths/matrix/Matrix.js";
// import { TexturePool } from "../../rendering/renderers/shared/texture/TexturePool.mjs";
// import { Bounds } from "./bounds/Bounds.mjs";
// import { clearList } from "./utils/clearList.js";
import { executeInstructions } from "./utils/executeInstructions.js";
import { updateRenderGroupTransforms } from "./utils/updateRenderGroupTransforms.js";
// import { validateRenderables } from "./utils/validateRenderables.mjs";

const tempMatrix = new Matrix();

const renderGroupSystem = {
	new(renderer) {
		this._renderer = renderer;
	},
	render({ container, transform }) {
		const parent = container.parent;
		const renderGroupParent = container.renderGroup.renderGroupParent;
		container.parent = null;
		container.renderGroup.renderGroupParent = null;
		const renderer = this._renderer;
		// let originalLocalTransform = tempMatrix;
		// if (transform) {
		// 	originalLocalTransform = originalLocalTransform.copyFrom(container.renderGroup.localTransform);
		// 	container.renderGroup.localTransform.copyFrom(transform);
		// }
		const renderPipes = renderer.renderPipes;
		// this._updateCachedRenderGroups(container.renderGroup, null);
		this._updateRenderGroups(container.renderGroup);
		renderer.globalUniforms.start({
			worldTransformMatrix: transform ? container.renderGroup.localTransform : container.renderGroup.worldTransform,
			worldColor: container.renderGroup.worldColorAlpha,
		});
		executeInstructions(container.renderGroup, renderPipes);
		// if (renderPipes.uniformBatch) {
		// 	renderPipes.uniformBatch.renderEnd();
		// }
		// if (transform) {
		// 	container.renderGroup.localTransform.copyFrom(originalLocalTransform);
		// }
		container.parent = parent;
		container.renderGroup.renderGroupParent = renderGroupParent;
	},
	_updateRenderGroups(renderGroup) {
		const renderer = this._renderer;
		const renderPipes = renderer.renderPipes;
		renderGroup.runOnRender(renderer);
		renderGroup.instructionSet.renderPipes = renderPipes;
		// if (!renderGroup.structureDidChange) {
		// 	validateRenderables(renderGroup, renderPipes);
		// } else {
		// 	clearList(renderGroup.childrenRenderablesToUpdate.list, 0);
		// }
		updateRenderGroupTransforms(renderGroup);
		if (renderGroup.structureDidChange) {
			renderGroup.structureDidChange = false;
			this._buildInstructions(renderGroup, renderer);
		} else {
			this._updateRenderables(renderGroup);
		}
		renderGroup.childrenRenderablesToUpdate.index = 0;
		renderer.renderPipes.batch.upload(renderGroup.instructionSet);
		if (renderGroup.isCachedAsTexture && !renderGroup.textureNeedsUpdate) return;
		for (let i = 0; i < renderGroup.renderGroupChildren.length; i++) {
			this._updateRenderGroups(renderGroup.renderGroupChildren[i]);
		}
	},
	_updateRenderables(renderGroup) {
		// const { list, index } = renderGroup.childrenRenderablesToUpdate;
		// for (let i = 0; i < index; i++) {
		// 	const container = list[i];
		// 	if (container.didViewUpdate) {
		// 		renderGroup.updateRenderable(container);
		// 	}
		// }
		// clearList(list, index);
	},
	_buildInstructions(renderGroup, rendererOrPipes) {
		const root = renderGroup.root;
		const instructionSet = renderGroup.instructionSet;
		instructionSet.reset();
		const renderer = rendererOrPipes.renderPipes ? rendererOrPipes : rendererOrPipes.batch.renderer;
		const renderPipes = renderer.renderPipes;
		renderPipes.batch.buildStart(instructionSet);
		renderPipes.blendMode.buildStart();
		renderPipes.colorMask.buildStart();
		if (root.sortableChildren) {
			root.sortChildren();
		}
		root.collectRenderablesWithEffects(instructionSet, renderer, null);
		renderPipes.batch.buildEnd(instructionSet);
		renderPipes.blendMode.buildEnd(instructionSet);
	},
};

export default renderGroupSystem;
