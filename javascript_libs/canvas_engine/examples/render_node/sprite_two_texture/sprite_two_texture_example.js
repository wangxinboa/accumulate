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
const sprite2DTwoTextures = [];
globalThis.sprite2DTwoTextures = sprite2DTwoTextures;

for (let i = 0; i < spriteTwoTextureImageUrls.length; i++) {
	const urls = spriteTwoTextureImageUrls[i];
	const sprite2D = Sprite2DTwoTexture.createFromUrl(urls[0], urls[1]);
	sprite2D.x = (i % 5) * 100;
	sprite2D.y = ((i - (i % 5)) / 5) * 100;
	sprite2D.pivotX = 0;
	sprite2D.pivotY = 0;

	sprite2DTwoTextures.push(sprite2D);

	engine.scene.add(sprite2D);
}

sprite2DTwoTextures[0].texture1.unpackFlipY = false;

sprite2DTwoTextures[0].texture2.unpackFlipY = true;
sprite2DTwoTextures[1].texture2.unpackFlipY = true;
sprite2DTwoTextures[2].texture2.unpackFlipY = true;
sprite2DTwoTextures[3].texture2.unpackFlipY = false;

const sprite2DUrls = ["https://pixijs.com/assets/flowerTop.png", "https://pixijs.com/assets/eggHead.png"];

/** @type {Array<Sprite2D>} */
const sprite2Ds = [];
globalThis.sprite2Ds = sprite2Ds;

for (let i = 0; i < sprite2DUrls.length; i++) {
	const sprite2D = Sprite2D.createFromUrl(sprite2DUrls[i]);
	sprite2D.x = (i % 5) * 300 + 100;
	sprite2D.y = ((i - (i % 5)) / 5) * 100 + 400;
	sprite2D.pivotX = 0.5;
	sprite2D.pivotY = 0.5;

	sprite2Ds.push(sprite2D);

	engine.scene.add(sprite2D);
}

let count = 0;
let isPositive = true;
engine.timeTicker.addRunCallback(function () {
	for (let i = 0; i < sprite2DTwoTextures.length; i++) {
		sprite2DTwoTextures[i].x += isPositive ? 0.5 : -0.5;
		sprite2DTwoTextures[i].y += isPositive ? 0.5 : -0.5;

		sprite2DTwoTextures[i].clamp = 1 - sprite2DTwoTextures[0].x / 100;
	}

	if (sprite2DTwoTextures[0].x > 100) {
		isPositive = false;
	} else if (sprite2DTwoTextures[0].x < 0) {
		isPositive = true;
	}

	if (isPositive) {
		count++;
	} else {
		count--;
	}
});
