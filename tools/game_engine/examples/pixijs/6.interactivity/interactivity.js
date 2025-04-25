import { GameEngine, Camera2D, Scene, ImageSwitcher, ImageObject } from '../../../src/index.js';

const camera = new Camera2D();
const scene = new Scene({
	wheelMoveCamera: true,
});
scene.bindCamera(camera);

const background = new ImageObject({
	url: './6.Interactivity/button_test_BG.jpg',
});
scene.add(background);


const gameEngine = new GameEngine({
	renderType: 'webgl',
	renderType: 'canvas',
	el: document.getElementById('renderCanvas'),
	backgroundColor: 0xffffff,
	scene: scene,
	dragLock: false,
	// eventsEnabled: false,
	// beforeUpdate() {
	// 	update();
	// },
});
window.gameEngine = gameEngine;


const buttons = [];
const buttonPositions = [175, 75,
	600 - 145, 75,
	600 / 2 - 20, 400 / 2 + 10,
	175, 400 - 75,
	600 - 115, 400 - 95];

const urls = [
	'./6.interactivity/button.png',
	'./6.interactivity/buttonDown.png',
	'./6.interactivity/buttonOver.png'
];

let nowDragButton = null;
function onDragstart() {
	console.info('onDragstart');
	nowDragButton = this;
	this.imageTaskIndex = 1;
}
function onDragend() {
	console.info('onDragend');
	this.imageTaskIndex = 0;
}
function onPointerEnter() {
	console.info('onPointerEnter');
	if (nowDragButton !== this) {
		this.imageTaskIndex = 2;
	}
}
function onPointerLeave() {
	console.info('onPointerLeave');
	if (nowDragButton !== this) {
		this.imageTaskIndex = 0;
	}
}

for (let i = 0; i < 5; i++) {
	const button = new ImageSwitcher({
		imageTaskIndex: 0,
		urls
	});
	scene.add(button);
	buttons.push(button);

	// button.anchorX = 0.5;
	// button.anchorY = 0.5;

	button.x = buttonPositions[i * 2];
	button.y = buttonPositions[i * 2 + 1];

	button.on('dragstart', onDragstart);
	button.on('dragend', onDragend);
	button.on('pointerenter', onPointerEnter);
	button.on('pointerleave', onPointerLeave);
}


buttons[0].scaleX = 1.2;

buttons[1].scaleY = 1.2;

buttons[2].rotation = Math.PI / 10;

buttons[3].scaleX = 0.8;
buttons[3].scaleY = 0.8;

buttons[4].scaleX = 0.8;
buttons[4].scaleY = 1.2;
buttons[4].rotation = Math.PI;
