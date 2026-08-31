import { engine } from "../canvas_engine_examples.module.js";
import { Sprite2D } from "../../src/render_nodes/2d/sprite2d/sprite2d.js";

/**
 * @type {Array<CanvasEngineType.Sprite2D>}
 */
const sprite2Ds = [];

sprite2Ds.push(Sprite2D.createFromText("Basic text in pixi"));

for (let i = 0; i < sprite2Ds.length; i++) {
	engine.scene.add(sprite2Ds[i]);
}

engine.timeTicker.start();

let count = 0;
let isPositive = true;

engine.timeTicker.addRunCallback(function () {
	for (let i = 0; i < sprite2Ds.length; i++) {
		sprite2Ds[i].x += isPositive ? 1 : -1;
		sprite2Ds[i].y += isPositive ? 1 : -1;

		sprite2Ds[i].rotationAngle += 1.8;
	}

	if (sprite2Ds[0].x > 100) {
		// engine.timeTicker.pause();
		isPositive = false;

		sprite2Ds[0].text = "Basic text in canvas_engine";
	} else if (sprite2Ds[0].x < 0) {
		isPositive = true;

		sprite2Ds[0].text = "Basic text in pixi";
	}

	if (isPositive) {
		count++;
	} else {
		count--;
	}
});
