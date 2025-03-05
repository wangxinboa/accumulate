import {
	Camera2D,
	CanvasRender,
	Scene2D,
	CanvasEvent,
} from '../../src/index.js';

export default function start2d(canvasDom, afterRender, rendererOptions) {
	const camera = new Camera2D();
	const scene = new Scene2D();
	scene.bindCamera(camera);

	let x = 0, y = 0, allowMove = false;
	scene.on('mousedown', function (e) {
		x = e.offsetX;
		y = e.offsetY;
		allowMove = true;
	});
	scene.on('mousemove', function (e) {
		// console.info('e:', e);
		// console.info('this.camera:', this.camera);
		if (allowMove) {
			camera.x += x - e.offsetX;
			camera.y += y - e.offsetY;
			x = e.offsetX;
			y = e.offsetY;
		}
	});
	scene.on('mouseup', function () {
		allowMove = false;
	});
	scene.on('wheel', function (e) {
		camera.x += e.deltaX;
		camera.y += e.deltaY;
	});

	const canvasEvent = new CanvasEvent(canvasDom);
	canvasEvent.bindScene(scene);

	const renderer = new CanvasRender(canvasDom, {
		...rendererOptions,
		onResize(width, height) {
			camera.setRange(width, height);
		}
	})

	function animationFrame() {
		requestAnimationFrame(animationFrame);
		renderer.render(scene);
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