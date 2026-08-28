import { Render2DNode } from "../../../../../javascript_libs/canvas_engine/src/canvas_engine.js";
import { defaultGameConfig } from "../../../assets/game_config.js";

/**
 * 管理 CardPanel 内所有按钮的布局与生命周期。
 * 按钮从 ButtonPool 中获取，释放时回收到池中。
 */
export class CardPanelButtonAreaUi extends Render2DNode {
	/** @type {Array<CardStoryGameType.Button>} */
	children = [];
	/**
	 * @param {CardStoryGameType.CardStoryGame} game
	 */
	constructor(game) {
		super();

		this.game = game;
		/** @type {CardStoryGameType.GameConfigData['uiConfig']['panel']['panelButtonArea']} */
		this.panelButtonAreaUiConfig = defaultGameConfig.uiConfig.panel.panelButtonArea;
		this.applyCameraTransform = false;

		this.topY = 0;
		this.bottomY = 0;
	}

	/**
	 * 从面板配置中读取按钮相关的样式与间距参数
	 * @param {CardStoryGameType.GameConfigData['uiConfig']['panel']['panelButtonArea']} panelButtonAreaUiConfig
	 */
	updateConfig(panelButtonAreaUiConfig) {
		this.panelButtonAreaUiConfig = panelButtonAreaUiConfig;

		if (this.children.length > 0) {
		}
	}

	/**
	 * 更新按钮列表：清空旧按钮，根据动作列表生成新按钮并布局
	 * @param {Array<CardStoryGameType.CardTemplateAction>} actionsData - 卡牌动作列表
	 * @param {Function} onClickCallback
	 */
	updateButtons(actionsData, onClickCallback) {
		if (!Array.isArray(actionsData)) {
			return;
		}

		const childrenLen = this.children.length;
		const actionsLen = actionsData.length;

		if (childrenLen < actionsLen) {
			for (let i = 0, len = actionsLen - childrenLen; i < len; i++) {
				this.game.buttonPool.acquire(this);
			}
		} else if (childrenLen > actionsLen) {
			for (let i = 0, len = childrenLen - actionsLen; i < len; i++) {
				this.game.buttonPool.release(this.children[0]);
			}
		}

		if (actionsData.length === 0) {
			return;
		}

		const panelHeight = this.game.panel.height;
		let currentButtonY = panelHeight - this.topY - this.panelButtonAreaUiConfig.marginTop,
			currentButtonX = this.panelButtonAreaUiConfig.x;

		for (let i = 0, len = actionsLen; i < len; i++) {
			const action = this.game.gameConfig.getCardAction(actionsData[i]);
			const button = this.children[i];

			button.updateConfig(this.panelButtonAreaUiConfig.buttonOption, action.label);
			button.applyCameraTransform = false;
			button.pivotY = 1;
			button.actionId = action.actionId;
			button.setClickCallback(onClickCallback);

			if (currentButtonX + button.width > this.panelButtonAreaUiConfig.width) {
				currentButtonX = this.panelButtonAreaUiConfig.x;
				currentButtonY -= button.height + this.panelButtonAreaUiConfig.gapY;
			}
			button.y = currentButtonY;
			button.x = currentButtonX;

			currentButtonX += this.panelButtonAreaUiConfig.gapX + button.width;
		}

		this.bottomY = panelHeight - currentButtonY + this.children[0].height;
	}

	/**
	 * @param {number} topY
	 */
	startSetTopY(topY) {
		this.topY = topY;
		this.bottomY = topY;
	}
}
