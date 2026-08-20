import { CardStoryGame as CardStoryGameClass } from "./card_story_game.js";
import { Card as CardClass } from "./card_manager/card/card.js";
import { CardPanel as CardPanelClass } from "./card_panel/card_panel.js";
import { Button as ButtonClass } from "./game_ui/button/button.js";
import { ButtonPool as ButtonPoolClass } from "./game_ui/button/button_pool.js";
import { defaultGameConfig } from "../assets/game_config.js";

declare global {
	namespace CardStoryGameType {
		type CardStoryGame = CardStoryGameClass;
		type Card = CardClass;
		type CardPanel = CardPanelClass;

		type Button = ButtonClass;
		type ButtonPool = ButtonPoolClass;
		type ButtonOption = {
			padding: { left: number; right: number; top: number; bottom: number };
			bgColor: RgbaColor;
			titleTextureOption: CanvasEngineType.TextOption;
			fixedGeometry?: boolean;
		};

		type UIConfig = (typeof defaultGameConfig)["uiConfig"];
		/** 游戏配置数据（game_config.json 结构） */
		interface GameConfigData {
			cardTemplates?: CardTemplate[];
			actions?: ActionConfig[];
			events?: EventConfig[];
			attributes?: AttributeConfig[];
			environmentalRules?: EnvironmentalRuleConfig[];
			slotGenerationRules?: SlotGenerationRuleConfig[];
			logicOperators?: LogicOperatorsConfig;
			/** UI 配置，所有字段均有默认值 */
			uiConfig: UIConfig;
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

		type CardTemplateAction =
			| {
					label?: string;
					actionId: string;
			  }
			| string;
		interface CardTemplate {
			id: number;
			name: string;
			description: string;
			actions?: Array<CardTemplateAction>;
		}

		interface ActionConfig {
			actionId: string;
			label: string;
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
