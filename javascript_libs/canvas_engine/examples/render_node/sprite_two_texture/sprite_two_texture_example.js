import { Sprite2D } from "../../../src/render_node/2d/sprite2d/sprite2d.js";
import { Sprite2DTwoTexture } from "./sprite_two_texture.js";

const spriteTwoTextureImageUrls = [
	[
		"https://pixijs.com/assets/bunny.png",
		"https://fastly.picsum.photos/id/33/20/20.jpg?hmac=2qevnyLh9jL-kOMjRHF1xg1TyBmOATzt_B__g1C_E7Y",
	],
	[
		"https://pixijs.com/assets/bunny.png",
		"https://fastly.picsum.photos/id/902/20/20.jpg?hmac=1D9rRqsVpj0c559bCL-1Sd4HQ63BwJrzIjSze3DGFTA",
	],
	[
		"https://pixijs.com/assets/bunny.png",
		"https://fastly.picsum.photos/id/343/20/20.jpg?hmac=5Kl5BY351WQTvor_ar4Nrj3gXJi8G7clWzDjWB9Wz2o",
	],
	[
		"https://pixijs.com/assets/bunny.png",
		"https://fastly.picsum.photos/id/1027/20/20.jpg?hmac=H7OrzD_uAN3Gat2uSpNJEAn6Je8mtax_CWXdEmljiF8",
	],
	["https://pixijs.com/assets/bunny.png", "https://pixijs.com/assets/bunny.png"],
];

/** @type {Array<Sprite2DTwoTexture>} */
const sprite2dTwoTextures = [];
globalThis.sprite2dTwoTextures = sprite2dTwoTextures;

for (let i = 0; i < spriteTwoTextureImageUrls.length; i++) {
	const urls = spriteTwoTextureImageUrls[i];
	const sprite2d = Sprite2DTwoTexture.createFromUrl(urls[0], urls[1]);
	sprite2d.x = (i % 5) * 100;
	sprite2d.y = ((i - (i % 5)) / 5) * 100;
	sprite2d.pivotX = 0;
	sprite2d.pivotY = 0;

	sprite2dTwoTextures.push(sprite2d);

	engine.scene.add(sprite2d);
}

sprite2dTwoTextures[0].texture1.unpackFlipY = false;

sprite2dTwoTextures[0].texture2.unpackFlipY = true;
sprite2dTwoTextures[1].texture2.unpackFlipY = true;
sprite2dTwoTextures[2].texture2.unpackFlipY = true;
sprite2dTwoTextures[3].texture2.unpackFlipY = false;

const sprite2dUrls = ["https://pixijs.com/assets/flowerTop.png", "https://pixijs.com/assets/eggHead.png"];

/** @type {Array<Sprite2D>} */
const sprite2ds = [];
globalThis.sprite2ds = sprite2ds;

for (let i = 0; i < sprite2dUrls.length; i++) {
	const sprite2d = Sprite2D.createFromUrl(sprite2dUrls[i]);
	sprite2d.x = (i % 5) * 300 + 100;
	sprite2d.y = ((i - (i % 5)) / 5) * 100 + 400;
	sprite2d.pivotX = 0.5;
	sprite2d.pivotY = 0.5;

	sprite2ds.push(sprite2d);

	engine.scene.add(sprite2d);
}

let count = 0;
let isPositive = true;
engine.timeTicker.addRunCallback(function () {
	for (let i = 0; i < sprite2dTwoTextures.length; i++) {
		sprite2dTwoTextures[i].x += isPositive ? 0.5 : -0.5;
		sprite2dTwoTextures[i].y += isPositive ? 0.5 : -0.5;

		sprite2dTwoTextures[i].clamp = 1 - sprite2dTwoTextures[0].x / 100;
	}

	if (sprite2dTwoTextures[0].x > 100) {
		isPositive = false;
	} else if (sprite2dTwoTextures[0].x < 0) {
		isPositive = true;
	}

	if (isPositive) {
		count++;
	} else {
		count--;
	}
});
