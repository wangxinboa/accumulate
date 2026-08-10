import { CardStoryGame as CardStoryGameClass } from "./card_story_game.js";
import { Card as CardClass } from "./card_manager/card/card.js";
import { CardPanel as CardPanelClass } from "./card_manager/card_panel/card_panel.js";

declare global {
	namespace CardStoryGameType {
		type CardStoryGame = CardStoryGameClass;
		type Card = CardClass;
		type CardPanel = CardPanelClass;

		/** 游戏存档数据（saveData 字段） */
		interface SaveData {
			cards: Card[];
		}

		/** 游戏 JSON 数据完整结构 */
		interface GameData {
			/** 存档数据，当 mode 为 "continue" 时必填 */
			saveData?: SaveData;
		}

		// ===== 配置相关类型 =====
		interface CardTemplateConfig {
			id: number;
			name: string;
			description: string;
			actions?: Array<{
				label: string;
				actionId: number;
			}>;
		}

		interface ActionConfig {
			id: number;
			name: string;
			description: string;
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

		/**
		 * UI 配置接口
		 * 所有字段均有默认值，定义在 assets/game_config.js 中
		 * JSON 文件中的值会覆盖默认值
		 */
		interface UIConfig {
			// ---- 卡牌相关 ----
			/** 卡牌内边距（像素） */
			cardPadding: CardPadding;
			/** 卡牌宽度（像素） */
			cardWidth: number;
			/** 卡牌高度（像素） */
			cardHeight: number;
			/** 卡牌水平间距（像素） */
			cardGapX: number;
			/** 卡牌垂直间距（像素） */
			cardGapY: number;
			/** 卡牌背景色（RGBA 对象） */
			cardBgColor: RgbaColor;
			/** 卡牌文字颜色（RGBA 对象） */
			cardTextColor: RgbaColor;
			/** 卡牌文字字号（像素） */
			cardFontSize: number;
			/** 卡牌文字字体族 */
			cardFontFamily: string;
			/** 卡牌文字区域高度占卡牌宽度的比例（如 0.333 表示 1/3） */
			cardTextHeightRatio: number;

			// ---- 面板相关 ----
			/** 面板宽度（像素） */
			panelWidth: number;
			/** 面板背景色（RGBA 对象） */
			panelBgColor: RgbaColor;
			/** 面板文字颜色（RGBA 对象） */
			panelTextColor: RgbaColor;
			/** 面板标题高度（像素） */
			panelTitleHeight: number;
			/** 面板标题 X 偏移（像素） */
			panelTitleX: number;
			/** 面板标题 Y 偏移（像素） */
			panelTitleY: number;
			/** 面板标题字号（像素） */
			panelTitleFontSize: number;
			/** 面板标题字体族 */
			panelTitleFontFamily: string;
			/** 面板描述文字字号（像素） */
			panelDescFontSize: number;
			/** 面板描述文字字体族 */
			panelDescFontFamily: string;
			/** 面板高度占画布高度的比例（0~1） */
			panelHeightRatio: number;
			/** 面板 Y 偏移（像素，用于大屏） */
			panelYOffset: number;
			/** 面板 Y 偏移比例（用于小屏，乘以画布高度） */
			panelYOffsetSmall: number;

			// ---- 描述区域 ----
			/** 描述矩形的位置和尺寸 */
			descriptionRect: DescriptionRectConfig;
			/** 描述文字字号（像素，兼容旧字段，实际使用 panelDescFontSize） */
			descriptionFontSize: number;

			// ---- 引擎相关 ----
			/** 引擎背景色（RGBA 对象） */
			engineBackgroundColor: RgbaColor;

			// ---- 网格系统 ----
			/** 网格坐标偏移量（用于生成唯一键，避免负数冲突） */
			gridCoordOffset: number;
			/** BFS 搜索空闲网格的最大深度 */
			gridMaxSearchDepth: number;

			// ---- 渲染层级 ----
			/** 卡牌默认 Z 轴顺序 */
			cardZIndex: number;
			/** 面板 Z 轴顺序（高于卡牌） */
			panelZIndex: number;

			// ---- 滚动控制 ----
			/** 是否反转滚轮方向（true 表示手指向下文字向上移动，false 表示向下移动） */
			scrollInvert: boolean;
		}

		/** 游戏配置数据（game_config.json 结构） */
		interface GameConfigData {
			cardTemplates?: CardTemplateConfig[];
			actions?: ActionConfig[];
			events?: EventConfig[];
			attributes?: AttributeConfig[];
			environmentalRules?: EnvironmentalRuleConfig[];
			slotGenerationRules?: SlotGenerationRuleConfig[];
			logicOperators?: LogicOperatorsConfig;
			/** UI 配置，所有字段均有默认值 */
			uiConfig: UIConfig;
		}
	}
}

export { CardStoryGameType };
