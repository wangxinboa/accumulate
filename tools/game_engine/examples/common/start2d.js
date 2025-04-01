import {
	Camera2D,
	CanvasRender,
	Scene,
	CanvasEvent,
} from '../../src/index.js';

export default function start2d(canvasDom, afterRender, rendererOptions) {
	const camera = new Camera2D();
	const scene = new Scene();
	scene.bindCamera(camera);

	scene.on('wheel', function (dx, dy) {
		camera.x += dx;
		camera.y -= dy;
	});

	const canvasEvent = new CanvasEvent(canvasDom);
	canvasEvent.bindScene(scene);

	const renderer = new CanvasRender(canvasDom, {
		...rendererOptions,
		onResize(width, height) {
			camera.setRange(width, height);
		}
	})

	function animationFrame(time = 0) {
		requestAnimationFrame(animationFrame);
		renderer.render(scene, time);
		if (afterRender) {
			afterRender();
		}
	}
	animationFrame();

	return {
		camera,
		scene,
		renderer,
		canvasEvent,
	}
}