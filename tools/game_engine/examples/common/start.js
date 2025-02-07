import {
	Camera2d,
	CanvasRender,
	Scene,
} from '../../src/index.js';

export const canvasDom = document.getElementById('renderCanvas');
export const camera = new Camera2d();
export const scene = new Scene();
export const renderer = new CanvasRender(canvasDom, {
	onResize(width, height) {
		camera.setRange(width, height);
	}
});

let afterRender = null;
function animationFrame() {
	requestAnimationFrame(animationFrame);
	renderer.render(scene, camera);
	if (afterRender) {
		afterRender();
	}
}
function start(callback) {
	animationFrame();
	afterRender = callback;
}

export default start;