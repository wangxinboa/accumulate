import { Render2DNode } from "./render_2d_node.js";

export class Scene2D extends Render2DNode {
	/** @type {Array<CanvasEngineType.Render2DNode>} */
	allDescendants;
	constructor() {
		super();

		this.isScene2D = true;

		this.allDescendants = [];
	}
	/**
	 * @param {CanvasEngineType.Render2DNode} node
	 */
	registerDescendant(node) {
		this.allDescendants.push(node);
	}
	clearDescendants() {
		this.allDescendants.length = 0;
	}
}
