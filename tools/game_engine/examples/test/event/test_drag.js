
import { Rect, Scene, Camera2D, Circle } from '../../../src/index.js';

const camera = new Camera2D();
const scene = new Scene({
	wheelMoveCamera: true,
});
scene.bindCamera(camera);

const rectDrag = new Rect({
	x: 400,
	y: 300,

	width: 150,
	height: 150,
	// rxlt: 150,
	// rylt: 150,

	fill: '#00ffff',
	stroke: '#0000ff',
	strokeWidth: 0,
});
rectDrag.on('drag', (dragX, dragY) => {
	// console
	rectDrag.x = dragX;
	rectDrag.y = dragY;
});
scene.add(rectDrag);

const rectMove = new Rect({
	x: 25,
	y: 25,

	width: 50,
	height: 50,

	fill: '#0000ff',
	stroke: '#0000ff',
	strokeWidth: 0,
});
rectMove.on('pointermove', () => {
	console.info('rectMove pointermove');
	rectMove.fill = '#ff0000';
});
rectMove.on('pointerleave', () => {
	console.info('rectMove pointerleave');
	rectMove.fill = '#0000ff';
});
scene.add(rectMove);

const rectMoveEnter = new Rect({
	x: 300,
	y: 50,

	width: 100,
	height: 100,

	fill: '#0000ff',
	stroke: '#0000ff',
	strokeWidth: 0,
});
rectMoveEnter.on('pointerenter', () => {
	console.info('rectMoveEnter pointerenter');
	rectMoveEnter.fill = '#ff0000';
});
rectMoveEnter.on('pointerleave', () => {
	console.info('rectMoveEnter pointerleave');
	rectMoveEnter.fill = '#0000ff';
});
scene.add(rectMoveEnter);


const circle = new Circle({
	radius: 6,
	startAngle: 0,
	endAngle: 360,

	fill: '#000000',
	//fill: null,
	//strokeWidth: 1,
	//stroke: '#0000ff',
	renderOrder: 1,
	hitTestCountable: false,
});
// object2dCanMove(circle);
// scene.on('pointermove', (x, y) => {
// 	circle.x = x;
// 	circle.y = y;
// });
scene.directEvent.on('pointermove', (x, y) => {
	circle.x = x;
	circle.y = y;
});
scene.add(circle);

export default scene;