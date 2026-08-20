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
		/** @type {CardStoryGameType.UIConfig['panel']['panelButtonArea']} 布局配置 */
		this.config = defaultGameConfig.uiConfig.panel.panelButtonArea;
		this.applyCameraTransform = false;

		this.topY = 0;
		/** @type {CardStoryGameType.GameConfigData['uiConfig']['panel']['panelButtonArea']} */
		this.panelButtonAreaUiConfig = defaultGameConfig.uiConfig.panel.panelButtonArea;
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
	 * @param {Array<CardStoryGameType.CardTemplateAction>} actions - 卡牌动作列表
	 * @param {Function} onClickCallback
	 */
	updateButtons(actions, onClickCallback) {
		if (!Array.isArray(actions)) {
			return;
		}

		const childrenLen = this.children.length;
		const actionsLen = actions.length;

		if (childrenLen < actionsLen) {
			for (let i = 0, len = actionsLen - childrenLen; i < len; i++) {
				this.game.buttonPool.acquire(this);
			}
		} else if (childrenLen > actionsLen) {
			for (let i = 0, len = childrenLen - actionsLen; i < len; i++) {
				this.game.buttonPool.release(this.children[0]);
			}
		}

		if (actions.length === 0) {
			return;
		}

		const panelHeight = this.game.panel.height;
		let nowButtonY = panelHeight - this.topY - this.panelButtonAreaUiConfig.marginTop,
			nowButtonX = this.panelButtonAreaUiConfig.x;

		for (let i = 0, len = actionsLen; i < len; i++) {
			const action = this.game.gameConfig.getCardAction(actions[i]);
			const button = this.children[i];

			button.updateConfig(this.panelButtonAreaUiConfig.buttonOption, action.label);
			button.applyCameraTransform = false;
			button.pivotY = 1;
			button.actionId = action.actionId;
			button.setClickCallback(onClickCallback);

			if (nowButtonX + button.width > this.panelButtonAreaUiConfig.width) {
				nowButtonX = this.panelButtonAreaUiConfig.x;
				nowButtonY -= button.height + this.panelButtonAreaUiConfig.gapY;
			}
			button.y = nowButtonY;
			button.x = nowButtonX;

			nowButtonX += this.panelButtonAreaUiConfig.gapX + button.width;
		}
	}
}
