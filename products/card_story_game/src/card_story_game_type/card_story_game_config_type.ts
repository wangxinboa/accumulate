import { defaultGameConfig } from "../../assets/game_config.js";

declare global {
	namespace CardStoryGameType {
		// ===== 从 defaultGameConfig 推导的配置类型 =====
		type UIConfig = (typeof defaultGameConfig)["uiConfig"];
		type ActionConfig = (typeof defaultGameConfig)["actions"][number];

		/** 游戏配置数据（game_config.json 结构） */
		interface GameConfigData {
			uiConfig: UIConfig;
			cardTemplates?: CardTemplate[];

			actions?: ActionConfig[];
			events?: EventConfig[];
			attributes?: AttributeConfig[];
			environmentalRules?: EnvironmentalRuleConfig[];
			slotGenerationRules?: SlotGenerationRuleConfig[];
			logicOperators?: LogicOperatorsConfig;
		}

		/** 游戏存档数据（saveData 字段） */
		interface SaveData {
			cards: Card[];
		}
		/** 游戏 JSON 数据完整结构 */
		interface GameData {
			/** 存档数据，当 mode 为 "continue" 时必填 */
			saveData?: SaveData;
		}

		type CardTemplateAction = {
			label?: string;
			actionId: string;
		};
		interface CardTemplate {
			id: number;
			name: string;
			description: string;
			actions?: Array<CardTemplateAction>;
		}

		interface EventConfig {
			id: number;
		}

		interface AttributeConfig {
			id: number;
			type: string;
			name: string;
		}

		interface EnvironmentalRuleConfig {
			id: string;
			description: string;
		}

		interface SlotGenerationRuleConfig {
			id: string;
			description: string;
		}

		interface LogicOperatorsConfig {
			[key: string]: string;
		}

		// ===== UI 配置 =====
		interface CardPadding {
			left: number;
			right: number;
			top: number;
			bottom: number;
		}

		/** 描述矩形配置 */
		interface DescriptionRectConfig {
			x: number;
			y: number;
			width: number;
			height: number;
		}

		/** RGBA 颜色对象，分量范围为 0~1 */
		interface RgbaColor {
			r: number;
			g: number;
			b: number;
			a: number;
		}
	}
}

export { CardStoryGameType };
