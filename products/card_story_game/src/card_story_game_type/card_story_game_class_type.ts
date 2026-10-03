import { CardStoryGame as CardStoryGameClass } from "../card_story_game.js";
import { Card as CardClass } from "../card_manager/card/card.js";
import { CardPanel as CardPanelClass } from "../card_panel/card_panel.js";
import { CardPanelSlot as CardPanelSlotClass } from "../card_panel/card_panel_ui/card_panel_slot_ui/card_panel_slot.js";
import { CardPanelButton as CardPanelButtonClass } from "../card_panel/card_panel_ui/card_panel_button_ui/card_panel_button.js";
import { CardStateTypeEnum as _CardStateTypeEnum } from "../card_manager/card/card_contants.js";

declare global {
	namespace CardStoryGameType {
		// ===== 类类型 =====
		type CardStoryGame = CardStoryGameClass;
		type Card = CardClass;
		type CardStateTypeEnum = keyof typeof _CardStateTypeEnum;
		type CardPanel = CardPanelClass;
		type CardPanelSlot = CardPanelSlotClass;

		type CardPanelButton = CardPanelButtonClass;
		type CardPanelButtonOption = {
			padding: { left: number; right: number; top: number; bottom: number };
			bgColor: RgbaColor;
			selectedBgColor: RgbaColor;
			titleTextureOption: CanvasEngineType.TextOption;
			fixedGeometry?: boolean;
		};
	}
}

export { CardStoryGameType };
