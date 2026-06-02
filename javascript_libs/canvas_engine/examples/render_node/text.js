import { Canvas2DEngine } from "../../src/canvas_2d_engine.js";
import { Text } from "../../src/render_node/2d/text/text.js";

const engine = new Canvas2DEngine({
	container: document.body,
	rendererType: "webgl",
	autoStart: true,
	// waitLoadingCompleteStart: false,
	backgroundColor: 0xffffff,
});

globalThis.engine = engine;

/**
 * @type {CanvasEngineType.Text[]}
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
