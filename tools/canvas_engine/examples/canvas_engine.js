import GUI from './libs/lil-gui/lil-gui.esm.js'
import CanvasEngine from '../src/canvas_engine.js';
import Circle from '../src/objects/2d/circle.js';
import Rect from '../src/objects/2d/rect.js';
import Polyline from '../src/objects/2d/polyline.js';
import Polygon from '../src/objects/2d/polygon.js';
import Text from '../src/objects/2d/text.js';

const canvasDom = document.getElementById('renderCanvas');
const canvasEngine = new CanvasEngine(canvasDom, {
	fitType: 'fill',
	renderType: '2d',
});

globalThis.canvasEngine = canvasEngine;

const circle = new Circle(canvasEngine.scene, {
	radius: 12,
	startAngle: 0,
	endAngle: 360,

	fill: '#ff0000',
	//fill: null,
	//strokeWidth: 1,
	//stroke: '#0000ff',
});

const rect = new Rect(canvasEngine.scene, {
	x: 400,
	y: 300,

	width: 300,
	height: 300,
	rxlt: 150,
	rylt: 150,

	fill: '#ffff00',
	stroke: '#0000ff',
	strokeWidth: 0,
});

const polyline = new Polyline(canvasEngine.scene, {
	points: [
		{ x: 60, y: 20 },
		{ x: 60, y: 80 },
		{ x: 120, y: 80 },
		{ x: 120, y: 20 },
	],
	fill: '#ff0000',
	// fill: null,
	strokeWidth: 2,
	stroke: '#000000',
});

const polygon = new Polygon(canvasEngine.scene, {
	points: [
		{ x: 100 + 60, y: 20 },
		{ x: 100 + 60, y: 80 },
		{ x: 100 + 120, y: 80 },
		{ x: 100 + 120, y: 20 },
	],
	fill: '#ff0000',
	// fill: null,
	strokeWidth: 2,
	stroke: '#000000',
});

const text = new Text(canvasEngine.scene, {
	x: 0,
	y: 200,
	text: 'font-size',
	// text: 'Hello world!\nAAA\nBBB',
	fill: '#000000',
	// fill: null,
	// strokeWidth: 2,
	// stroke: '#000000',
});
// text.add(rect);

const gui = new GUI();

function onChangeFun() {
	canvasEngine.requestRender();
}
onChangeFun();

function initTransformGui(folder, target) {
	folder.add(target, 'x', -600, 600, 0.01).onChange(onChangeFun);
	folder.add(target, 'y', -600, 600, 0.01).onChange(onChangeFun);
	folder.add(target, 'scaleX', -10, 10).onChange(onChangeFun);
	folder.add(target, 'scaleY', -10, 10).onChange(onChangeFun);
	folder.add(target, 'rotationAngle', -180, 180, 1).name('rotationAngle').onChange(onChangeFun);
}
function initObject2dGui(folder, target) {

	folder.add(target, 'strokeWidth', 0, 30, 1).onChange(onChangeFun);
	folder.add(target, 'opacity', 0, 1, 0.01).onChange(onChangeFun);
	initTransformGui(folder, target);
}
{
	const camera2dFolder = gui.addFolder('camera2d');
	camera2dFolder.close();

	initTransformGui(camera2dFolder, canvasEngine.renderer.camera);
}
{
	const circleFolder = gui.addFolder('circle');

	circleFolder.add(circle, 'radius', 0, 300).name('radius').onChange(onChangeFun);
	circleFolder.add(circle, 'visible').onChange(onChangeFun);
	circleFolder.close();

	initObject2dGui(circleFolder, circle);
}
{
	const rectFolder = gui.addFolder('rect');
	rectFolder.close();

	rectFolder.add(rect, 'width', -600, 600).onChange(onChangeFun);
	rectFolder.add(rect, 'height', -600, 600).onChange(onChangeFun);
	rectFolder.add(rect, 'visible').onChange(onChangeFun);

	['rxlt', 'rxrt', 'ryrt', 'ryrb', 'rxrb', 'rxlb', 'rylb', 'rylt'].forEach((radius) => {
		rectFolder.add(rect, radius, 0, 150).onChange(() => {
			canvasEngine.requestRender();
		});
	});
	initObject2dGui(rectFolder, rect);
}
{
	const polylineFolder = gui.addFolder('polyline');
	polylineFolder.close();

	initObject2dGui(polylineFolder, polyline);
}
{
	const polygonFolder = gui.addFolder('polygon');
	polygonFolder.close();

	initObject2dGui(polygonFolder, polygon);
}
{
	const textFolder = gui.addFolder('text');
	textFolder.close();

	initObject2dGui(textFolder, text);
}