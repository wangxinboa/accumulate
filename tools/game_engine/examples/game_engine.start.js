import '../../../javascript_libs/lil-gui/dist/lil-gui.umd.min.js';
import {
	GameEngine,
	Circle, Rect, Text, Sprite, Polyline, Polygon,
	Scene,
	Camera2D
} from '../src/index.js';

import testAnimation from './test/animation/test_animation.js';
import testDrag from './test/event/test_drag.js';
import testKeyPress from './test/event/test_key_press.js';
import testLoaderImage from './test/loader/test_loader_image.js';
import testMultiSprite from './test/objects/sprite/test_multi_sprite.js';
import testSprite from './test/objects/sprite/test_sprite.js';

const camera = new Camera2D();
const startScene = new Scene({
	wheelMoveCamera: true,
});
startScene.bindCamera(camera);
const gameEngine = new GameEngine({
	el: document.getElementById('renderCanvas'),
	scene: startScene,
});
window.gameEngine = gameEngine;

// const circle = new Circle({
// 	radius: 12,
// 	startAngle: 0,
// 	endAngle: 360,

// 	fill: '#0000ff',
// 	renderOrder: 1,
// });
// startScene.directEvent.on('pointermove', (x, y) => {
// 	circle.x = x;
// 	circle.y = y;
// });
// startScene.add(circle);

const backButton = new Text({
	x: 0,
	y: 0,
	text: '返回',
	fontSize: 26,
	backgroundColor: '#ff00ff',
	// text: 'Hello world!\nAAA\nBBB',
	fill: '#0000ff',
	// fill: null,
	// strokeWidth: 2,
	stroke: '#0000ff',
	applyCameraTransform: false,
});

let exampleCount = 0, allexampleUrlHeight = 0;
function toExampleScene() {
	gameEngine.changeScene(this.data);
	this.data.emit('toExampleScene');
}
function addExample(name, scene) {
	const exampleUrl = new Text({
		text: name,
		fill: '#0000ff',
		x: 0,
		y: allexampleUrlHeight + 12 * exampleCount,
		data: scene,
		applyCameraTransform: false,
	});
	allexampleUrlHeight += exampleUrl.height;
	startScene.add(exampleUrl);
	exampleCount++;

	exampleUrl.on('pointerdown', toExampleScene);
}


addExample('testAnimation', testAnimation);
addExample('testDrag', testDrag);
addExample('testKeyPress', testKeyPress);
addExample('testLoaderImage', testLoaderImage);
addExample('testMultiSprite', testMultiSprite);
addExample('testSprite', testSprite);