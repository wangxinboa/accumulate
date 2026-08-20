import { BaseCleanUp } from "../../../../../javascript_libs/javascript_utils/javascript_utils.js";
import { Button } from "./button.js";

export class ButtonPool extends BaseCleanUp {
	constructor() {
		super();
		/** @type {Array<Button>} */
		this._pool = [];
	}
	/**
	 * @param {CanvasEngineType.Render2DNode} parentNode
	 */
	acquire(parentNode) {
		let button = this._pool.pop();
		if (!button) {
			button = new Button();
		}
		parentNode.add(button);
		return button;
	}

	/**
	 * @param {Button} button
	 */
	release(button) {
		if (button.parent) {
			button.parent.remove(button);
		}
		button.reset();
		this._pool.push(button);
	}

	clear() {
		for (let i = 0, len = this._pool.length; i < len; i++) {
			this._pool[i].destroy();
		}
		this._pool.length = 0;
	}

	destroy() {
		this.clear();

		super.destroy();
	}
}
