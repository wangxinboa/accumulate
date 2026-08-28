import { BaseCleanUp } from "../../../javascript_utils/javascript_utils.js";

/**
 * @template {CanvasEngineType.RenderNode} T
 */
export class RenderNodePool extends BaseCleanUp {
	/**
	 * @param {new () => T} renderNodeClass - 构造函数
	 */
	constructor(renderNodeClass) {
		super();

		/** @private @type {Array<T>} */
		this._pool = [];

		/** @private @type {new () => T} */
		this._renderNodeClass = renderNodeClass;
	}

	/**
	 * 从池中获取一个槽位实例
	 * @param {CanvasEngineType.RenderNode} parentNode
	 * @returns {T}
	 */
	acquire(parentNode) {
		/** @type {T | undefined} */
		let renderNode = this._pool.pop();

		if (!renderNode) {
			renderNode = new this._renderNodeClass();
		}

		parentNode.add(renderNode);
		return /** @type {T} */ (renderNode);
	}

	/**
	 * 回收一个槽位实例到池中
	 * @param {T} renderNode
	 */
	release(renderNode) {
		if (renderNode.parent) {
			renderNode.parent.remove(renderNode);
		}
		this._pool.push(renderNode);
	}

	/**
	 * 清空池中所有槽位
	 */
	clear() {
		for (let i = this._pool.length - 1; i >= 0; i--) {
			this._pool[i].destroy();
		}
		this._pool.length = 0;
	}

	destroy() {
		this.clear();
		super.destroy();
	}
}
