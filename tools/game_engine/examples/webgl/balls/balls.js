import { GameEngine, ImageObject, Scene, Camera2D } from '../../../src/index.js';

const camera = new Camera2D();
const scene = new Scene({
	wheelMoveCamera: true,
});
scene.bindCamera(camera);

//	Globals, globals everywhere and not a drop to drink
var w = window.innerWidth;
var h = window.innerHeight;
var starCount = 25;
var sx = 1.0 + (Math.random() / 20);
var sy = 1.0 + (Math.random() / 20);
var slideX = w / 2;
var slideY = h / 2;
var stars = [];

for (var i = 0; i < starCount; i++) {
	let ball = new ImageObject({
		url: `./balls/assets/bubble_32x32.png`,
		x: (Math.random() * w) - slideX,
		y: (Math.random() * h) - slideY,
		anchorX: 0.5,
		anchorY: 0.5,
	});

	stars.push({ imageObject: ball, x: ball.x, y: ball.y });

	scene.add(ball);
}

window.newWave = newWave;
function newWave(x, y) {
	sx = x;
	sy = y;
}

const gameEngine = new GameEngine({
	renderType: 'webgl',
	el: document.getElementById('renderCanvas'),
	backgroundColor: 0x000000,
	scene: scene,
	beforeUpdate() {
		for (var i = 0; i < starCount; i++) {
			stars[i].imageObject.x = stars[i].x + slideX;
			stars[i].imageObject.y = stars[i].y + slideY;
			stars[i].x = stars[i].x * sx;
			stars[i].y = stars[i].y * sy;

			if (stars[i].x > w) {
				stars[i].x = stars[i].x - w;
			}
			else if (stars[i].x < -w) {
				stars[i].x = stars[i].x + w;
			}

			if (stars[i].y > h) {
				stars[i].y = stars[i].y - h;
			}
			else if (stars[i].y < -h) {
				stars[i].y = stars[i].y + h;
			}
		}
	},
});
window.gameEngine = gameEngine;
