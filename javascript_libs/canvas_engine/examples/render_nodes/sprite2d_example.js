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

const udpateTextureText = Sprite2D.createFromText(`更新 texture`);
udpateTextureText.x = 100;
udpateTextureText.y = 0;
engine.scene.add(udpateTextureText);

const udpateTexture = Sprite2D.createFromTexture(textures[0]);
udpateTexture.x = 100;
udpateTexture.y = 50;
udpateTexture.pivotX = 0.5;
udpateTexture.pivotY = 0.5;

engine.scene.add(udpateTexture);

const fixedUdpateTextureText = Sprite2D.createFromText(`fixed 更新 texture`);
fixedUdpateTextureText.x = 300;
fixedUdpateTextureText.y = 0;
engine.scene.add(fixedUdpateTextureText);

const fixedUdpateTexture = Sprite2D.createFromTexture(textures[0]);
fixedUdpateTexture.x = 300;
fixedUdpateTexture.y = 50;
fixedUdpateTexture.fixGeometry(60, 90);
fixedUdpateTexture.dragUpdatesPosition = true;
engine.scene.add(fixedUdpateTexture);

let count = 0;
let textureIndex = 0;

engine.timeTicker.addRunCallback(function () {
	if (count > 30) {
		fixedUdpateTexture.texture = udpateTexture.texture = textures[++textureIndex % textures.length];
		count = 0;
	}

	count++;
});
