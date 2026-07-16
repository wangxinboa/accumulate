import { Render2DNode } from "./render_2d_node.js";

export class Scene2D extends Render2DNode {
	/** @type {Array<CanvasEngineType.Render2DNode>} */
	allEventDescendants;
	constructor() {
		super();

		this.isScene2D = true;

		this.allEventDescendants = [];
	}
	/**
	 * @param {CanvasEngineType.Render2DNode} node
	 */
	registerEventDescendant(node) {
		this.allEventDescendants.push(node);
	}
	clearEventDescendants() {
		this.allEventDescendants.length = 0;
	}
}
