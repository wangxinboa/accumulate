import { Canvas2DEngine } from "../../src/canvas_2d_engine.js";
import { Sprite2D } from "../../src/render_node/2d/sprite2d/sprite2d.js";

const engine = new Canvas2DEngine({
	container: document.body,
	rendererType: "webgl",
	autoStart: true,
	waitLoadingCompleteStart: true,
	backgroundColor: 0xffffff,
});

globalThis.engine = engine;

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

// const texture = new

const imageUrls = [
	// "https://fastly.picsum.photos/id/33/20/20.jpg?hmac=2qevnyLh9jL-kOMjRHF1xg1TyBmOATzt_B__g1C_E7Y",
	// "https://fastly.picsum.photos/id/902/20/20.jpg?hmac=1D9rRqsVpj0c559bCL-1Sd4HQ63BwJrzIjSze3DGFTA",
	// "https://fastly.picsum.photos/id/343/20/20.jpg?hmac=5Kl5BY351WQTvor_ar4Nrj3gXJi8G7clWzDjWB9Wz2o",
	// "https://fastly.picsum.photos/id/1027/20/20.jpg?hmac=H7OrzD_uAN3Gat2uSpNJEAn6Je8mtax_CWXdEmljiF8",
	// `../assets/number_images/0.png`,
	// `../assets/number_images/1.png`,
	// `../assets/number_images/2.png`,
	// `../assets/number_images/3.png`,
	// `../assets/number_images/4.png`,
	// `../assets/number_images/5.png`,
	// `../assets/number_images/6.png`,
	// `../assets/number_images/7.png`,
	"https://pixijs.com/assets/bunny.png",
	// "https://pixijs.com/examples/previews/animated-sprite_particles_thumbnail.webp",
	// "http://localhost:7999/examples/resources/sky.jpg",
];

/**
 * @type {CanvasEngineType.Sprite2D[]}
 */
const sprite2ds = [];
globalThis.sprite2ds = sprite2ds;

for (let i = 0; i < imageUrls.length; i++) {
	const sprite2d = Sprite2D.createFromUrl(imageUrls[i]);
	// sprite2d.x = i * 20;
	// sprite2d.y = i * 20;
	sprite2ds.push(sprite2d);

	engine.scene.add(sprite2d);
}

let count = 0;
engine.timeTicker.addRunCallback(function () {
	console.info("count:", count);
	sprite2ds[0].x += 1;
	sprite2ds[0].y += 1;

	// sprite2ds[0].rotationAngle += 1;

	if (count > 100) {
		engine.timeTicker.parse();
	}
	count++;
});
