import { BaseCleanUp, CustomMap } from "../../../../javascript_libs/javascript_utils/javascript_utils.js";
import { defaultGameConfig } from "../../assets/game_config.js";

/**
 * 游戏配置类，存储所有静态配置数据
 */
export class GameConfig extends BaseCleanUp {
	constructor() {
		super();

		/** @type {CustomMap<CardStoryGameType.CardTemplate>} 卡牌模板，key 为 templateId */
		this.cardTemplates = new CustomMap();
		/** @type {CustomMap<CardStoryGameType.ActionConfig>} 动作定义，key 为 actionId */
		this.actions = new CustomMap();
		/** @type {CustomMap<CardStoryGameType.EventConfig>} 事件定义，key 为 eventId */
		this.events = new CustomMap();
		/** @type {CustomMap<CardStoryGameType.AttributeConfig>} 属性定义，key 为 attributeId */
		this.attributes = new CustomMap();
		/** @type {CustomMap<CardStoryGameType.EnvironmentalRuleConfig>} 环境规则，key 为 ruleId */
		this.environmentalRules = new CustomMap();
		/** @type {CustomMap<CardStoryGameType.SlotGenerationRuleConfig>} 槽生成规则，key 为 ruleId */
		this.slotGenerationRules = new CustomMap();
		/** @type {CardStoryGameType.LogicOperatorsConfig} 逻辑算子定义 */
		this.logicOperators = {};

		/** @type {CardStoryGameType.UIConfig} 从 JSON 加载的原始 UI 配置（未合并默认值） */
		this.uiConfig = defaultGameConfig.uiConfig;
		/** @private @type {CardStoryGameType.UIConfig} 默认 UI 配置（来自 game_config.js） */
		this._defaultUiConfig = defaultGameConfig.uiConfig;
	}

	/**
	 * 从 JSON 数据初始化配置
	 * @param {CardStoryGameType.GameConfigData} data - 配置数据（来自 game_config.json）
	 */
	initConfig(data) {
		// 清空现有数据
		this.cardTemplates.clear();
		this.actions.clear();
		this.events.clear();
		this.attributes.clear();
		this.environmentalRules.clear();
		this.slotGenerationRules.clear();

		// 加载卡牌模板
		if (data.cardTemplates) {
			for (let i = 0, len = data.cardTemplates.length; i < len; i++) {
				const template = data.cardTemplates[i];
				this.cardTemplates.set(template.id, template);
			}
		}

		// 加载动作定义
		if (data.actions) {
			for (let i = 0, len = data.actions.length; i < len; i++) {
				const action = data.actions[i];
				this.actions.set(action.actionId, action);
			}
		}

		// 加载事件定义
		if (data.events) {
			for (let i = 0, len = data.events.length; i < len; i++) {
				const event = data.events[i];
				this.events.set(event.id, event);
			}
		}

		// 加载属性定义
		if (data.attributes) {
			for (let i = 0, len = data.attributes.length; i < len; i++) {
				const attribute = data.attributes[i];
				this.attributes.set(attribute.id, attribute);
			}
		}

		// 加载环境规则
		if (data.environmentalRules) {
			for (let i = 0, len = data.environmentalRules.length; i < len; i++) {
				const rule = data.environmentalRules[i];
				this.environmentalRules.set(rule.id, rule);
			}
		}

		// 加载槽生成规则
		if (data.slotGenerationRules) {
			for (let i = 0, len = data.slotGenerationRules.length; i < len; i++) {
				const rule = data.slotGenerationRules[i];
				this.slotGenerationRules.set(rule.id, rule);
			}
		}

		// 加载逻辑算子
		if (data.logicOperators) {
			this.logicOperators = data.logicOperators;
		}

		// 加载 UI 配置（原始数据，不与默认值合并）
		if (data.uiConfig) {
			this.uiConfig = data.uiConfig;
		}
	}

	/**
	 * 根据 ID 获取卡牌模板
	 * @param {number} id
	 * @returns {CardStoryGameType.CardTemplate | null}
	 */
	getCardTemplate(id) {
		return this.cardTemplates.get(id) || null;
	}

	/**
	 * @param {CardStoryGameType.CardTemplateAction} cardAction
	 * @returns {CardStoryGameType.ActionConfig}
	 */
	getCardAction(cardAction) {
		let action;
		if (typeof cardAction === "string") {
			action = this.actions.get(cardAction);
		} else {
			action = this.actions.get(cardAction.actionId);
		}

		if (action) {
			return action;
		} else {
			console.error(cardAction);
			throw new Error("不存在对应动作的信息");
		}
	}

	/**
	 * 根据 ID 获取动作定义
	 * @param {number} id
	 * @returns {CardStoryGameType.ActionConfig | null}
	 */
	getAction(id) {
		return this.actions.get(id) || null;
	}

	/**
	 * 根据 ID 获取事件定义
	 * @param {number} id
	 * @returns {CardStoryGameType.EventConfig | null}
	 */
	getEvent(id) {
		return this.events.get(id) || null;
	}

	/**
	 * 根据 ID 获取属性定义
	 * @param {number} id
	 * @returns {CardStoryGameType.AttributeConfig | null}
	 */
	getAttribute(id) {
		return this.attributes.get(id) || null;
	}

	/**
	 * 销毁配置，清理所有数据
	 */
	destroy() {
		this.cardTemplates.destroy();
		this.actions.destroy();
		this.events.destroy();
		this.attributes.destroy();
		this.environmentalRules.destroy();
		this.slotGenerationRules.destroy();

		super.destroy();
	}
}
