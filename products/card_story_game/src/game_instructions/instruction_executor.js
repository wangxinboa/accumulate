import { InstructionTypeEnum } from "./instruction_type.js";

/**
 * 指令执行器（InstructionExecutor）
 *
 * 设计原则：
 *   - 每一条指令对应本类上的一个同名方法。方法名与 InstructionTypeEnum 的值
 *     一一对应，通过 execute(type, params) 动态分发。
 *   - 新增一条指令，只需在 InstructionTypeEnum 中声明，并在本类中添加同名方法。
 *   - 方法只做"翻译"：把指令参数翻译成对 game 门面的调用，不直接操作渲染节点。
 */
export class InstructionExecutor {
	/**
	 * @param {CardStoryGameType.CardStoryGame} game - 游戏门面
	 */
	constructor(game) {
		/** @type {CardStoryGameType.CardStoryGame} */
		this.game = game;
	}

	/**
	 * 执行一条指令。
	 *
	 * 通过 type 动态查找本类上的同名方法。方法不存在时打印警告并返回，
	 * 不抛出异常，保证调用方（配置驱动）不会因为一条指令写错而中断整个流程。
	 *
	 * @param {string} type - 指令类型，对应 InstructionTypeEnum 的值
	 * @param {any} params - 指令参数
	 */
	execute(type, params) {
		switch (type) {
			case InstructionTypeEnum.createCard:
				this.createCard(params);
				break;
			case InstructionTypeEnum.removeCard:
				this.removeCard(params);
				break;
			case InstructionTypeEnum.openCardPanel:
				this.openCardPanel(params);
				break;
			case InstructionTypeEnum.closeCardPanel:
				this.closeCardPanel();
				break;
			case InstructionTypeEnum.selectCardPanelButton:
				this.selectCardPanelButton(params);
				break;
			default:
				console.warn(`[InstructionExecutor] 未实现的指令类型: ${type}`);
		}
	}

	// ========================
	// 卡牌生命周期
	// ========================

	/**
	 * @param {Object} params
	 * @param {number} params.templateId - 卡牌模板 ID
	 * @param {number} [params.gridX] - 卡牌网格 X 坐标（可选，若未指定则随机放置）
	 * @param {number} [params.gridY] - 卡牌网格 Y 坐标（可选，若未指定则随机放置）
	 */
	createCard(params) {
		this.game.cardManager.createCardToGridToNearestFree(params.templateId, params.gridX ?? 0, params.gridY ?? 0);
	}

	/**
	 * 从场景中移除一张卡牌（回收进对象池）。
	 *
	 * @param {Object} params
	 * @param {CardStoryGameType.Card} params.card - 要移除的卡牌实例
	 */
	removeCard(params) {
		this.game.cardManager.removeCard(params.card);
	}

	// ========================
	// 卡牌面板
	// ========================

	/**
	 * @param {Object} params
	 * @param {CardStoryGameType.Card} params.card - 要展示的卡牌实例
	 */
	openCardPanel(params) {
		this.game.panel.show(params.card);
	}

	/**
	 * 关闭卡牌面板，同时清空当前主卡牌与所有槽位。
	 * 等价于用户点击面板外的空白区域。
	 */
	closeCardPanel() {
		this.game.panel.hide();
	}

	/**
	 * @param {Object} params
	 * @param {string} params.actionId - 目标按钮的动作 ID
	 */
	selectCardPanelButton(params) {
		this.game.panel.selectCurrentButtonByActionId(params.actionId);
	}
}
