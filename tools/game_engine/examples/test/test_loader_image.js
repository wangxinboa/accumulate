import { Image } from '../../src/index.js';
import { allowObject2dCanMove } from '../common/object2d_move.js';
import start2d from '../common/start2d.js';

// 测试 sat 效果
const { renderer, scene } = start2d(document.getElementById('renderCanvas'));
allowObject2dCanMove(scene);

const imageCount = 50;
for (let i = 0; i < imageCount; i++) {
	const image = new Image({
		url: `./number_images/${i}.png`,
		x: Math.floor(i / 5) * 60,
		y: (i % 5) * 60,
		scaleX: 2,
		scaleY: 2,
	});
	scene.addObject(image);
}