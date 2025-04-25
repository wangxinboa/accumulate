import { GameEngine, ImageObject, Scene, Camera2D } from '../../../src/index.js';

const camera = new Camera2D();
const scene = new Scene({
	wheelMoveCamera: true,
});
scene.bindCamera(camera);

const bunny = new ImageObject({
	url: `./1.basics/bunny.png`,
	x: 381,
	y: 338,
	scaleX: 1,
	scaleY: 1,
	anchorX: 0.5,
	anchorY: 0.5,
});
scene.add(bunny);

const bunny1 = new ImageObject({
	url: `./1.basics/bunny.png`,
	x: 0,
	y: 0,
	scaleX: 1,
	scaleY: 1,
});
scene.add(bunny1);

const bunny2 = new ImageObject({
	url: `./1.basics/bunny.png`,
	x: 762,
	y: 676,
	scaleX: 1,
	scaleY: 1,
	anchorX: 1,
	anchorY: 1,
});
scene.add(bunny2);

scene.directEvent.on('pointermove', (x, y) => {
	bunny.x = x;
	bunny.y = y;
});

const gameEngine = new GameEngine({
	renderType: 'webgl',
	el: document.getElementById('renderCanvas'),
	backgroundColor: 0x66FF99,
	scene: scene,
	beforeUpdate() {
		bunny.rotation += 0.1;
	},
});
window.gameEngine = gameEngine;
