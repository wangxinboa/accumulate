import { BaseCleanUp } from "../../../javascript_utils/javascript_utils.js";

let renderNodeId = 0;

export class RenderNode extends BaseCleanUp {
	/** @type {string} */
	id;
	/** @type {boolean} */
	isRenderNode;
	/** @type {RenderNode | null} */
	parent;
	/** @type {Array<RenderNode>} */
	children;
	/** @type {boolean} */
	visible;

	constructor() {
		super();

		this.id = `${renderNodeId++}`;
		this.isRenderNode = true;

		this.parent = null;
		this.children = [];

		this.visible = true;
	}
	/**
	 * @param {RenderNode} renderNode
	 */
	add(renderNode) {
		if (!this.children.includes(renderNode)) {
			if (renderNode.parent !== null) {
				renderNode.parent.remove(renderNode);
			}
			renderNode.parent = this;
			this.children.push(renderNode);

			this.afterAddChild();
		}
		return this;
	}
	afterAddChild() {}
	/**
	 * @param {RenderNode} renderNode
	 */
	remove(renderNode) {
		const index = this.children.indexOf(renderNode);
		if (index !== -1) {
			renderNode.parent = null;
			this.children.splice(index, 1);

			this.afterRemoveChild();
		}
		return this;
	}
	afterRemoveChild() {}

	destroy() {
		for (let i = this.children.length - 1; i >= 0; i--) {
			this.children[i].destroy();
		}
		if (this.parent) {
			this.parent.remove(this);
		}

		super.destroy();
	}
}
