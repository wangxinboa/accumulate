import { GameEngine, Camera2D, Scene, ImageSwitcher } from '../../../src/index.js';

const urls = [
	"./3.movie_clip/tp/explosion/Explosion_Sequence_A 1.png",
	"./3.movie_clip/tp/explosion/Explosion_Sequence_A 10.png",
	"./3.movie_clip/tp/explosion/Explosion_Sequence_A 11.png",
	"./3.movie_clip/tp/explosion/Explosion_Sequence_A 12.png",
	"./3.movie_clip/tp/explosion/Explosion_Sequence_A 13.png",
	"./3.movie_clip/tp/explosion/Explosion_Sequence_A 14.png",
	"./3.movie_clip/tp/explosion/Explosion_Sequence_A 15.png",
	"./3.movie_clip/tp/explosion/Explosion_Sequence_A 16.png",
	"./3.movie_clip/tp/explosion/Explosion_Sequence_A 17.png",
	"./3.movie_clip/tp/explosion/Explosion_Sequence_A 18.png",
	"./3.movie_clip/tp/explosion/Explosion_Sequence_A 19.png",
	"./3.movie_clip/tp/explosion/Explosion_Sequence_A 2.png",
	"./3.movie_clip/tp/explosion/Explosion_Sequence_A 20.png",
	"./3.movie_clip/tp/explosion/Explosion_Sequence_A 21.png",
	"./3.movie_clip/tp/explosion/Explosion_Sequence_A 22.png",
	"./3.movie_clip/tp/explosion/Explosion_Sequence_A 23.png",
	"./3.movie_clip/tp/explosion/Explosion_Sequence_A 24.png",
	"./3.movie_clip/tp/explosion/Explosion_Sequence_A 25.png",
	"./3.movie_clip/tp/explosion/Explosion_Sequence_A 26.png",
	"./3.movie_clip/tp/explosion/Explosion_Sequence_A 27.png",
	"./3.movie_clip/tp/explosion/Explosion_Sequence_A 3.png",
	"./3.movie_clip/tp/explosion/Explosion_Sequence_A 4.png",
	"./3.movie_clip/tp/explosion/Explosion_Sequence_A 5.png",
	"./3.movie_clip/tp/explosion/Explosion_Sequence_A 6.png",
	"./3.movie_clip/tp/explosion/Explosion_Sequence_A 7.png",
	"./3.movie_clip/tp/explosion/Explosion_Sequence_A 8.png",
	"./3.movie_clip/tp/explosion/Explosion_Sequence_A 9.png"
];

const camera = new Camera2D();
const scene = new Scene({
	wheelMoveCamera: true,
});
scene.bindCamera(camera);

const imageSwitcherClipAnimation = [
	{ target: { imageTaskIndex: 1, }, duration: 20, },
	{ target: { imageTaskIndex: 2, }, duration: 20, },
	{ target: { imageTaskIndex: 3, }, duration: 20, },
	{ target: { imageTaskIndex: 4, }, duration: 20, },
	{ target: { imageTaskIndex: 5, }, duration: 20, },
	{ target: { imageTaskIndex: 6, }, duration: 20, },
	{ target: { imageTaskIndex: 7, }, duration: 20, },
	{ target: { imageTaskIndex: 8, }, duration: 20, },
	{ target: { imageTaskIndex: 9, }, duration: 20, },
	{ target: { imageTaskIndex: 10, }, duration: 20, },
	{ target: { imageTaskIndex: 11, }, duration: 20, },
	{ target: { imageTaskIndex: 12, }, duration: 20, },
	{ target: { imageTaskIndex: 13, }, duration: 20, },
	{ target: { imageTaskIndex: 14, }, duration: 20, },
	{ target: { imageTaskIndex: 15, }, duration: 20, },
	{ target: { imageTaskIndex: 16, }, duration: 20, },
	{ target: { imageTaskIndex: 17, }, duration: 20, },
	{ target: { imageTaskIndex: 18, }, duration: 20, },
	{ target: { imageTaskIndex: 19, }, duration: 20, },
	{ target: { imageTaskIndex: 20, }, duration: 20, },
	{ target: { imageTaskIndex: 21, }, duration: 20, },
	{ target: { imageTaskIndex: 22, }, duration: 20, },
	{ target: { imageTaskIndex: 23, }, duration: 20, },
	{ target: { imageTaskIndex: 24, }, duration: 20, },
	{ target: { imageTaskIndex: 25, }, duration: 20, },
	{ target: { imageTaskIndex: 26, }, duration: 20, },
];

for (var i = 0; i < 50; i++) {
	const imageSwitcher = new ImageSwitcher({
		urls,
		x: Math.random() * 800,
		y: Math.random() * 600,
		rotation: Math.random() * Math.PI,
		anchorX: 0.5,
		anchorY: 0.5,
		imageTaskIndex: 19,
	});
	imageSwitcher.scaleX = imageSwitcher.scaleY = 0.75 + Math.random() * 0.5;

	imageSwitcher.addAnimationIndex('clip', imageSwitcherClipAnimation).loop(Infinity).startDelayTime(Math.random() * 2000);
	imageSwitcher.startAnimation('clip');

	scene.add(imageSwitcher);
}


const gameEngine = new GameEngine({
	renderType: 'webgl',
	el: document.getElementById('renderCanvas'),
	backgroundColor: 0x000000,
	scene: scene,
	eventsEnabled: false,
	// beforeUpdate() {
	// 	update();
	// },
});
window.gameEngine = gameEngine;