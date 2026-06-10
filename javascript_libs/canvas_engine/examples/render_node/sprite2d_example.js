import { engine } from "../canvas_engine.module.js";
import { Sprite2D } from "../../src/render_node/2d/sprite2d/sprite2d.js";

// LoaderManager.addImageTasks([
// 	"https://fastly.picsum.photos/id/33/20/20.jpg?hmac=2qevnyLh9jL-kOMjRHF1xg1TyBmOATzt_B__g1C_E7Y",
// 	"https://fastly.picsum.photos/id/902/20/20.jpg?hmac=1D9rRqsVpj0c559bCL-1Sd4HQ63BwJrzIjSze3DGFTA",
// 	"https://fastly.picsum.photos/id/343/20/20.jpg?hmac=5Kl5BY351WQTvor_ar4Nrj3gXJi8G7clWzDjWB9Wz2o",
// 	"https://fastly.picsum.photos/id/1027/20/20.jpg?hmac=H7OrzD_uAN3Gat2uSpNJEAn6Je8mtax_CWXdEmljiF8",
// 	`../assets/number_images/0.png`,
// 	`../assets/number_images/1.png`,
// 	`../assets/number_images/2.png`,
// 	`../assets/number_images/3.png`,
// 	`../assets/number_images/4.png`,
// 	`../assets/number_images/5.png`,
// 	`../assets/number_images/6.png`,
// 	`../assets/number_images/7.png`,
// ]);

const imageUrls = [
	"https://pixijs.com/assets/bunny.png",
	"https://pixijs.com/assets/bunny.png",
	"https://pixijs.com/assets/bunny.png",
	"https://pixijs.com/assets/bunny.png",
	"https://pixijs.com/assets/bunny.png",
	"https://fastly.picsum.photos/id/33/20/20.jpg?hmac=2qevnyLh9jL-kOMjRHF1xg1TyBmOATzt_B__g1C_E7Y",
	"https://fastly.picsum.photos/id/902/20/20.jpg?hmac=1D9rRqsVpj0c559bCL-1Sd4HQ63BwJrzIjSze3DGFTA",
	"https://fastly.picsum.photos/id/343/20/20.jpg?hmac=5Kl5BY351WQTvor_ar4Nrj3gXJi8G7clWzDjWB9Wz2o",
	"https://fastly.picsum.photos/id/1027/20/20.jpg?hmac=H7OrzD_uAN3Gat2uSpNJEAn6Je8mtax_CWXdEmljiF8",
	// `../assets/number_images/0.png`,
	// `../assets/number_images/1.png`,
	// `../assets/number_images/2.png`,
	// `../assets/number_images/3.png`,
	// `../assets/number_images/4.png`,
	// `../assets/number_images/5.png`,
	// `../assets/number_images/6.png`,
	// `../assets/number_images/7.png`,
	// "https://pixijs.com/examples/previews/animated-sprite_particles_thumbnail.webp",
	// "http://localhost:7999/examples/resources/sky.jpg",
];

/**
 * @type {Array<CanvasEngineType.Sprite2D>}
 */
const sprite2Ds = [];
globalThis.sprite2Ds = sprite2Ds;

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
		// engine.timeTicker.parse();
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
