import { engine } from "../canvas_engine_examples.module.js";
import { Sprite2D } from "../../src/render_node/2d/sprite2d/sprite2d.js";
import { ImageTexture } from "../../src/textures/image_texture.js";

const textureUrls = [
	"../assets/bunny.png",
	"../assets/33-20x20.jpg",
	"../assets/902-20x20.jpg",
	"../assets/343-20x20.jpg",
	"../assets/1027-20x20.jpg",
];

/**
 * @type {Array<CanvasEngineType.Sprite2DTexture>}
 */
const textures = [];

for (let i = 0; i < textureUrls.length; i++) {
	textures.push(ImageTexture.createFromUrl(textureUrls[i]));
}

const sprite2D = Sprite2D.createFromUrl(textureUrls[0]);
sprite2D.x = 100;
sprite2D.y = 100;
sprite2D.pivotX = 0.5;
sprite2D.pivotY = 0.5;

engine.scene.add(sprite2D);

let count = 0;
let textureIndex = 0;
engine.timeTicker.addRunCallback(function () {
	if (count > 30) {
		sprite2D.texture = textures[++textureIndex % textures.length];
		count = 0;
	}

	count++;
});
