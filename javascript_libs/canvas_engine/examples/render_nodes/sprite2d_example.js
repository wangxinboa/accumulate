import { engine } from "../canvas_engine_examples.module.js";
import { Sprite2D } from "../../src/render_nodes/2d/sprite2d/sprite2d.js";

const imageUrls = [
	"../assets/bunny.png",
	"../assets/bunny.png",
	"../assets/bunny.png",
	"../assets/bunny.png",
	"../assets/bunny.png",
	"../assets/33-20x20.jpg",
	"../assets/902-20x20.jpg",
	"../assets/343-20x20.jpg",
	"../assets/1027-20x20.jpg",
];

/**
 * @type {Array<CanvasEngineType.Sprite2D>}
 */
const sprite2Ds = [];

for (let i = 0; i < imageUrls.length; i++) {
	const sprite2D = Sprite2D.createFromUrl(imageUrls[i]);
	sprite2D.x = (i % 5) * 100;
	sprite2D.y = ((i - (i % 5)) / 5) * 100;
	sprite2D.pivotX = 0.5;
	sprite2D.pivotY = 0.5;

	sprite2Ds.push(sprite2D);

	engine.scene.add(sprite2D);
}

// sprite2Ds[0].texture.unpackFlipY = false;
// sprite2Ds[1].texture.unpackFlipY = true;
// sprite2Ds[2].texture.unpackFlipY = true;
// sprite2Ds[3].texture.unpackFlipY = true;
// sprite2Ds[4].texture.unpackFlipY = false;

let count = 0;
let isPositive = true;
engine.timeTicker.addRunCallback(function () {
	for (let i = 0; i < sprite2Ds.length; i++) {
		sprite2Ds[i].x += isPositive ? 0.2 : -0.2;
		sprite2Ds[i].y += isPositive ? 0.2 : -0.2;
	}

	// sprite2Ds[0].rotationAngle += 1;

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
