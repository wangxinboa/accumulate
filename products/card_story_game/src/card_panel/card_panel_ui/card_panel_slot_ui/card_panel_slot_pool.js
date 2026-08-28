import { BaseCleanUp } from "../../../../../../javascript_libs/javascript_utils/javascript_utils.js";
import { CardPanelSlot } from "./card_panel_slot.js";

export class CardPanelSlotPool extends BaseCleanUp {
	constructor() {
		super();

		/** @private @type {Array<CardStoryGameType.CardPanelSlot>} */
		this._pool = [];
	}

	/**
	 * 从池中获取一个槽位实例
	 * @param {CanvasEngineType.Render2DNode} parentNode - 父节点
	 * @returns {CardStoryGameType.CardPanelSlot}
	 */
	acquire(parentNode) {
		let slot = this._pool.pop();
		if (!slot) {
			slot = new CardPanelSlot();
		}
		parentNode.add(slot);
		return slot;
	}

	/**
	 * 回收一个槽位实例到池中
	 * @param {CardStoryGameType.CardPanelSlot} slot
	 */
	release(slot) {
		if (slot.parent) {
			slot.parent.remove(slot);
		}

		slot.reset();
		this._pool.push(slot);
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
