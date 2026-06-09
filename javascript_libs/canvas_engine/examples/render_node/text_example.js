import { engine } from "../canvas_engine.module.js";
import { Sprite2D } from "../../src/render_node/2d/sprite2d/sprite2d.js";

/**
 * @type {Array<CanvasEngineType.Sprite2D>}
 */
const sprite2ds = [];
globalThis.sprite2ds = sprite2ds;

sprite2ds.push(Sprite2D.createFromText("Basic text in pixi"));

for (let i = 0; i < sprite2ds.length; i++) {
	engine.scene.add(sprite2ds[i]);
}

engine.timeTicker.start();

let count = 0;
let isPositive = true;

engine.timeTicker.addRunCallback(function () {
	for (let i = 0; i < sprite2ds.length; i++) {
		sprite2ds[i].x += isPositive ? 1 : -1;
		sprite2ds[i].y += isPositive ? 1 : -1;
	}

	if (sprite2ds[0].x > 100) {
		// engine.timeTicker.parse();
		isPositive = false;

		sprite2ds[0].text = "Basic text in canvas_engine";
	} else if (sprite2ds[0].x < 0) {
		isPositive = true;

		sprite2ds[0].text = "Basic text in pixi";
	}

	if (isPositive) {
		count++;
	} else {
		count--;
	}
});
