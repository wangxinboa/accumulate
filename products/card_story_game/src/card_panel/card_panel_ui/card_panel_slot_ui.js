import {
	RectangleDef,
	Render2DNode,
	RenderNodePool,
} from "../../../../../javascript_libs/canvas_engine/src/canvas_engine.js";
import { defaultGameConfig } from "../../../assets/game_config.js";
import { CardPanelSlot } from "./card_panel_slot_ui/card_panel_slot.js";

/**
 * 管理 CardPanel 内所有槽位的布局与生命周期。
 * 槽位实例从内部的 CardPanelSlotPool 中获取，释放时回收到池中。
 */
export class CardPanelSlotAreaUi extends Render2DNode {
	/** @type {Array<CardStoryGameType.CardPanelSlot>} */
	children = [];
	/**
	 * @param {CardStoryGameType.CardStoryGame} game
	 */
	constructor(game) {
		super();

		this.game = game;
		/** @type {CardStoryGameType.UIConfig['panel']['panelSlotArea']} */
		this.panelSlotAreaConfig = defaultGameConfig.uiConfig.panel.panelSlotArea;
		this.applyCameraTransform = false;

		this.topY = 0;
		this.bottomY = 0;

		/** @private  槽位对象池（内部管理） */
		this._slotPool = new RenderNodePool(CardPanelSlot);

		/** @type {CardPanelSlot | null} */
		this._currentHoverSlot = null;
	}

	/**
	 * 从面板配置中读取槽位相关的样式与间距参数
	 * @param {CardStoryGameType.UIConfig['panel']['panelSlotArea']} panelSlotAreaConfig
	 */
	updateConfig(panelSlotAreaConfig) {
		this.panelSlotAreaConfig = panelSlotAreaConfig;
	}

	/**
	 * 更新槽位列表：清空旧槽位，根据槽位数据生成新槽位并布局
	 * @param {Array<{label: string}>} slotsData - 槽位数据数组，每个元素有 label
	 */
	updateSlots(slotsData) {
		if (!Array.isArray(slotsData)) {
			return;
		}

		const childrenLen = this.children.length;
		const slotsLen = slotsData.length;

		if (childrenLen < slotsLen) {
			for (let i = 0, len = slotsLen - childrenLen; i < len; i++) {
				this._slotPool.acquire(this);
			}
		} else if (childrenLen > slotsLen) {
			for (let i = 0, len = childrenLen - slotsLen; i < len; i++) {
				this._slotPool.release(this.children[0]);
			}
		}

		if (slotsData.length === 0) {
			return;
		}

		const panelHeight = this.game.panel.height;
		let currentSlotX = this.panelSlotAreaConfig.x,
			currentSlotY = this.game.panel.height - this.topY - this.panelSlotAreaConfig.marginTop;

		for (let i = 0, len = slotsData.length; i < len; i++) {
			const slot = this.children[i];

			slot.updateConfig(this.panelSlotAreaConfig.slotOption);
			slot.applyCameraTransform = false;
			slot.pivotY = 1;

			if (currentSlotX + slot.width > this.panelSlotAreaConfig.width) {
				currentSlotX = this.panelSlotAreaConfig.x;
				currentSlotY -= slot.height + this.panelSlotAreaConfig.gapY;
			}

			slot.x = currentSlotX;
			slot.y = currentSlotY;

			currentSlotX += slot.width + this.panelSlotAreaConfig.gapX;
		}

		this.bottomY = panelHeight - currentSlotY + this.children[0].height;
	}

	/**
	 * @param {number} topY
	 */
	startSetTopY(topY) {
		this.topY = topY;
		this.bottomY = topY;
	}

	/**
	 * 获取与卡牌重叠且最近的卡槽。
	 * 同时有多个重叠时，取中心距离最近的卡槽。
	 *
	 * @param {CardStoryGameType.Card | null} card - 要检测的卡牌，传入 null 则清空悬停状态
	 */
	setCardOverlappingSlot(card) {
		let closestSlot = null;

		if (card) {
			// 计算卡牌 AABB（中心点坐标）
			card.updateView(this.game.engine.camera);

			// 卡牌中心坐标
			let closestDistSq = Infinity;
			// 遍历所有卡槽
			const slots = this.children;
			for (let i = 0, len = slots.length; i < len; i++) {
				const slot = slots[i];

				// 只检测 CardPanelSlot 类型
				if (!(slot instanceof CardPanelSlot)) {
					continue;
				}
				slot.updateView(this.game.engine.camera);

				// 检测卡牌与卡槽是否重叠
				const overlap = RectangleDef.isOverlapWithRectangle(
					card.viewLeft,
					card.viewBottom,
					card.viewRight,
					card.viewTop,
					slot.viewLeft,
					slot.viewBottom,
					slot.viewRight,
					slot.viewTop,
				);

				if (overlap) {
					// 计算卡牌中心到卡槽中心的平方距离（避免开平方，提高性能）
					const dx = card.viewCenterX - slot.viewCenterX;
					const dy = card.viewCenterY - slot.viewCenterY;
					const distSq = dx * dx + dy * dy;

					if (distSq < closestDistSq) {
						closestDistSq = distSq;
						closestSlot = slot;
					}
				}
			}
		}

		if (this._currentHoverSlot !== closestSlot) {
			if (this._currentHoverSlot) {
				this._currentHoverSlot.unHover();
			}

			if (closestSlot) {
				closestSlot.hover();
				this._currentHoverSlot = closestSlot;
			} else {
				this._currentHoverSlot = null;
			}
		}
	}

	destroy() {
		// 销毁池子
		this._slotPool.destroy();

		super.destroy();
	}
}
