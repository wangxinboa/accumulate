import { BaseCleanUp, TweenManager } from "../../../javascript_utils/javascript_utils.js";
import { Matrix4 } from "../math/matrix4.js";

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
	matrixNeedsUpdate;
	/** @type {Matrix4} */
	matrix;
	/** @type {Matrix4} */
	matrixWorld;
	/** @type {boolean} */
	visible;
	/** @type {TweenManager} */
	tweenManager;
	constructor() {
		super();

		this.id = `${renderNodeId++}`;
		this.isRenderNode = true;

		this.parent = null;
		this.children = [];

		this.matrixNeedsUpdate = true;
		this.matrix = new Matrix4();
		this.matrixWorld = new Matrix4();

		this.visible = true;

		this.tweenManager = new TweenManager();
	}
	/**
	 * @param {number} timestamp
	 */
	updateTween(timestamp) {
		this.tweenManager.update(timestamp, this);
		return this;
	}
	/**
	 * @param {string} tweenName
	 */
	startTween(tweenName) {
		this.tweenManager.start(tweenName, this);
		return this;
	}
	pauseTween() {
		this.tweenManager.pause();
		return this;
	}
	resumeTween() {
		this.tweenManager.resume();
		return this;
	}
	/**
	 * @param {string} tweenName
	 * @param {JavaScriptUtilsType.TweenConfig} tweenConfig
	 */
	setTween(tweenName, tweenConfig) {
		this.tweenManager.setTween(tweenName, tweenConfig);
		return this;
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
