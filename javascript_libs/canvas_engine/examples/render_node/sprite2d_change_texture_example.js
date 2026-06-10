import { engine } from "../canvas_engine.module.js";
import { Sprite2D } from "../../src/render_node/2d/sprite2d/sprite2d.js";
import { ImageTexture } from "../../src/texture/image_texture.js";

const textureUrls = [
	"https://pixijs.com/assets/bunny.png",
	"https://fastly.picsum.photos/id/33/20/20.jpg?hmac=2qevnyLh9jL-kOMjRHF1xg1TyBmOATzt_B__g1C_E7Y",
	"https://fastly.picsum.photos/id/902/20/20.jpg?hmac=1D9rRqsVpj0c559bCL-1Sd4HQ63BwJrzIjSze3DGFTA",
	"https://fastly.picsum.photos/id/343/20/20.jpg?hmac=5Kl5BY351WQTvor_ar4Nrj3gXJi8G7clWzDjWB9Wz2o",
	"https://fastly.picsum.photos/id/1027/20/20.jpg?hmac=H7OrzD_uAN3Gat2uSpNJEAn6Je8mtax_CWXdEmljiF8",
];

/**
 * @type {Array<CanvasEngineType.Sprite2DTexture>}
 */
const textures = [];

for (let i = 0; i < textureUrls.length; i++) {
	textures.push(ImageTexture.createFromUrl(textureUrls[i]));
}

globalThis.textures = textures;

const sprite2D = Sprite2D.createFromUrl(textureUrls[0]);
sprite2D.x = 100;
sprite2D.y = 100;
sprite2D.pivotX = 0.5;
sprite2D.pivotY = 0.5;

engine.scene.add(sprite2D);

globalThis.sprite2D = sprite2D;

let count = 0;
let textureIndex = 0;
engine.timeTicker.addRunCallback(function () {
	if (count > 30) {
		sprite2D.texture = textures[++textureIndex % textures.length];
		count = 0;
	}

	count++;
});
