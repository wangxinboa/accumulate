import { Bounds } from "../container/bounds/Bounds.js";
import { Container } from "../container/Container.js";

class ViewContainer extends Container {
	constructor(options) {
		super(options);
		this.canBundle = true;
		this.allowChildren = false;
		this._roundPixels = 0;
		this._lastUsed = -1;
		this._bounds = new Bounds(0, 1, 0, 0);
		this._boundsDirty = true;
	}
	get bounds() {
		if (!this._boundsDirty) return this._bounds;
		this.updateBounds();
		this._boundsDirty = false;
		return this._bounds;
	}
	// get roundPixels() {
	// 	return !!this._roundPixels;
	// }
	// set roundPixels(value) {
	// 	this._roundPixels = value ? 1 : 0;
	// }
	// containsPoint(point) {
	// 	const bounds = this.bounds;
	// 	const { x, y } = point;
	// 	return x >= bounds.minX && x <= bounds.maxX && y >= bounds.minY && y <= bounds.maxY;
	// }
	onViewUpdate() {
		this._didViewChangeTick++;
		this._boundsDirty = true;
		if (this.didViewUpdate) return;
		this.didViewUpdate = true;
		const renderGroup = this.renderGroup || this.parentRenderGroup;
		if (renderGroup) {
			renderGroup.onChildViewUpdate(this);
		}
	}
	// destroy(options) {
	// 	super.destroy(options);
	// 	this._bounds = null;
	// }
	collectRenderablesSimple(instructionSet, renderer, currentLayer) {
		const { renderPipes, renderableGC } = renderer;
		renderPipes.blendMode.setBlendMode(this, this.groupBlendMode, instructionSet);
		const rp = renderPipes;
		rp[this.renderPipeId].addRenderable(this, instructionSet);
		// renderableGC.addRenderable(this);
		this.didViewUpdate = false;
		const children = this.children;
		const length = children.length;
		for (let i = 0; i < length; i++) {
			children[i].collectRenderables(instructionSet, renderer, currentLayer);
		}
	}
}

export { ViewContainer };
