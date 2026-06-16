import { engine } from "../canvas_engine.module.js";
import { Sprite2D } from "../../src/render_node/2d/sprite2d/sprite2d.js";
import { TextTexture } from "../../src/texture/text_texture.js";

/**
 * @type {Array<CanvasEngineType.Sprite2D>}
 */
const sprite2Ds = [];
globalThis.sprite2Ds = sprite2Ds;

sprite2Ds.push(new Sprite2D(new TextTexture("Basic text in pixi")));

for (let i = 0; i < sprite2Ds.length; i++) {
	engine.scene.add(sprite2Ds[i]);
}

engine.timeTicker.start();

let count = 0;
let isPositive = true;

engine.timeTicker.addRunCallback(function () {
	for (let i = 0; i < sprite2Ds.length; i++) {
		sprite2Ds[i].x += isPositive ? 0.2 : -0.2;
		sprite2Ds[i].y += isPositive ? 0.2 : -0.2;
	}

	if (sprite2Ds[0].x > 100) {
		// engine.timeTicker.pause();
		isPositive = false;
	} else if (sprite2Ds[0].x < 0) {
		isPositive = true;
	}

	if (isPositive) {
		count++;
	} else {
		count--;
	}
});
