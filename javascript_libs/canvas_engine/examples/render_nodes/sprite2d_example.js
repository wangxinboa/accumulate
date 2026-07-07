import { engine } from "../canvas_engine_examples.module.js";
import { Sprite2D } from "../../src/render_nodes/2d/sprite2d/sprite2d.js";
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

const updateTextureText = Sprite2D.createFromText(`更新 texture`);
updateTextureText.x = 100;
updateTextureText.y = 0;
engine.scene.add(updateTextureText);

const updateTexture = Sprite2D.createFromTexture(textures[0]);
updateTexture.x = 100;
updateTexture.y = 50;
updateTexture.pivotX = 0.5;
updateTexture.pivotY = 0.5;

engine.scene.add(updateTexture);

const fixedUpdateTextureText = Sprite2D.createFromText(`fixed 更新 texture`);
fixedUpdateTextureText.x = 300;
fixedUpdateTextureText.y = 0;
engine.scene.add(fixedUpdateTextureText);

const fixedUpdateTexture = Sprite2D.createFromTexture(textures[0]);
fixedUpdateTexture.x = 300;
fixedUpdateTexture.y = 50;
fixedUpdateTexture.fixGeometry(60, 90);
fixedUpdateTexture.dragUpdatePosition = true;
engine.scene.add(fixedUpdateTexture);

let count = 0;
let textureIndex = 0;

engine.timeTicker.addRunCallback(function () {
	if (count > 30) {
		fixedUpdateTexture.texture = updateTexture.texture = textures[++textureIndex % textures.length];
		count = 0;
	}

	count++;
});
