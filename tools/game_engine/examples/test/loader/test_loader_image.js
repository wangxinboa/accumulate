import { Image, Scene, Camera2D } from '../../../src/index.js';

const camera = new Camera2D();
const scene = new Scene({
	wheelMoveCamera: true,
});
scene.bindCamera(camera);

let hasLoaded = false;
scene.on('toExampleScene', () => {
	if (!hasLoaded) {
		const imageCount = 50;
		// const imageCount = 10;
		for (let i = 0; i < imageCount; i++) {
			const image = new Image({
				url: `../examples/assets/number_images/${i}.png`,
				// url: `./number_images/${i}.jpg`,
				x: Math.floor(i / 5) * 60,
				y: (i % 5) * 60,
				scaleX: 2,
				scaleY: 2,
			});
			scene.add(image);
		}

		hasLoaded = true;
	}
});

export default scene;