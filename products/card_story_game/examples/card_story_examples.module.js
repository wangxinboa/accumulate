import { StatsTool } from "../../../javascript_libs/stats.js/stats.js";
import { CardStoryGame } from "../src/card_story_game.js";

globalThis.cardStoryGame = initCardStory();

function initCardStory() {
	const cardStoryGame = new CardStoryGame();

	StatsTool.init();
	cardStoryGame.engine.timeTicker.addRunCallback(function () {
		StatsTool.update();
	});

	return cardStoryGame;
}
