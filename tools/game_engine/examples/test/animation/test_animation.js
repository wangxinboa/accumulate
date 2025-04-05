import { Rect, Scene, Camera2D } from '../../../src/index.js';

const camera = new Camera2D();
const scene = new Scene({
	wheelMoveCamera: true,
});
scene.bindCamera(camera);
scene.on('pointerdown', () => {
	if (rect.isPlaying) {
		rect.pauseResumeAnimation();
	} else {
		rect.startAnimation('move');
	}
});

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
scene.add(rect);

export default scene;