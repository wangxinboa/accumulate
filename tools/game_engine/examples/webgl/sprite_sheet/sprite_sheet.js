import { GameEngine, Camera2D, Object2D, Scene, ImageObject } from '../../../src/index.js';

const urls = ["./sprite_sheet/tp/eggHead.png", "./sprite_sheet/tp/flowerTop.png", "./sprite_sheet/tp/helmlok.png", "./sprite_sheet/tp/skully.png"];
const camera = new Camera2D();
const scene = new Scene({
	wheelMoveCamera: true,
});
scene.bindCamera(camera);

const alienContainer = new Object2D();
alienContainer.x = 400;
alienContainer.y = 300;
scene.add(alienContainer);

const aliens = [];

for (var i = 0; i < 100; i++) {
	const imageObject = new ImageObject({
		url: urls[i % 4],
		x: Math.random() * 800 - 400,
		y: Math.random() * 600 - 300,
		rotation: Math.random() * Math.PI,
		anchorX: 0.5,
		anchorY: 0.5,
	});
	imageObject.scaleX = imageObject.scaleY = 0.75 + Math.random() * 0.5;

	aliens.push(imageObject);
	alienContainer.add(imageObject);
}


let count = 0;

const gameEngine = new GameEngine({
	renderType: 'webgl',
	el: document.getElementById('renderCanvas'),
	backgroundColor: 0x000000,
	scene: scene,
	eventsEnabled: false,
	beforeUpdate() {

		for (var i = 0; i < 100; i++) {
			var alien = aliens[i];
			alien.rotation += 0.1;
		}

		count += 0.01;
		alienContainer.scaleX = Math.sin(count);
		alienContainer.scaleY = Math.sin(count);

		alienContainer.rotation += 0.01;
	},
});
window.gameEngine = gameEngine;