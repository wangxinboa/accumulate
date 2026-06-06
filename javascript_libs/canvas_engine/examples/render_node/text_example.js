import { engine } from "../canvas_engine.module.js";
import { Text } from "../../src/render_node/2d/text/text.js";

/**
 * @type {Array<CanvasEngineType.Text>}
 */
const texts = [];
globalThis.texts = texts;

texts.push(new Text("Basic text in pixi"));

for (let i = 0; i < texts.length; i++) {
	engine.scene.add(texts[i]);
}

let count = 0;
let isPositive = true;

engine.timeTicker.addRunCallback(function () {
	for (let i = 0; i < texts.length; i++) {
		texts[i].x += isPositive ? 1 : -1;
		texts[i].y += isPositive ? 1 : -1;
	}

	if (texts[0].x > 100) {
		// engine.timeTicker.parse();
		isPositive = false;

		texts[0].text = "Basic text in canvas_engine";
	} else if (texts[0].x < 0) {
		isPositive = true;

		texts[0].text = "Basic text in pixi";
	}

	if (isPositive) {
		count++;
	} else {
		count--;
	}
});
