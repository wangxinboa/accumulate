import { Rect } from '../../src/index.js';
import { allowObject2dCanMove } from '../common/object2d_move.js';
import start2d from '../common/start2d.js';

// 测试 sat 效果
const { scene } = start2d(document.getElementById('renderCanvas'));
allowObject2dCanMove(scene);


const rect = new Rect({
	x: 400,
	y: 300,

	width: 300,
	height: 300,
	// rxlt: 150,
	// rylt: 150,

	fill: '#ffff00',
	stroke: '#0000ff',
	strokeWidth: 0,
});
rect.addAnimationTween('move', [
	{
		target: {
			x: 150,
			y: 150,
		},
		duration: 1000,
		repeat: 3,
		yoyo: true,
	},
	{
		target: {
			x: 400,
			y: 150,
		},
		repeat: 2,
		delayTime: 1000,
		duration: 500,
	},
]);

scene.addObject(rect);

setTimeout(() => {
	rect.startAnimation('move');
}, 400);