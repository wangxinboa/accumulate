import { CardStoryGame as CardStoryGameClass } from "./card_story_game.js";
import { Card as CardClass } from "./card_manager/card/card.js";
import { Panel as PanelClass } from "./panel/panel.js";

declare global {
	namespace CardStoryGameType {
		type CardStoryGame = CardStoryGameClass;
		type Card = CardClass;
		type Panel = PanelClass;

		/** 游戏存档数据（saveData 字段） */
		interface SaveData {
			cards: Card[];
		}

		/** 游戏 JSON 数据完整结构 */
		interface GameData {
			/** 存档数据，当 mode 为 "continue" 时必填 */
			saveData?: SaveData;
		}
	}
}

export { CardStoryGameType };
