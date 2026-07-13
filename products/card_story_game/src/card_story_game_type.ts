import { CardStoryGame as CardStoryGameClass } from "./card_story_game.js";
import { BaseCard as BaseCardClass } from "./card_manager/cards/base_card/base_card.js";

declare global {
	namespace CardStoryGameType {
		type CardStoryGame = CardStoryGameClass;
		type BaseCard = BaseCardClass;

		/** 游戏存档数据（saveData 字段） */
		interface SaveData {
			cards: BaseCard[];
		}

		/** 游戏 JSON 数据完整结构 */
		interface GameData {
			/** 存档数据，当 mode 为 "continue" 时必填 */
			saveData?: SaveData;
		}
	}
}

export { CardStoryGameType };
