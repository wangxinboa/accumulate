import { Rect, Circle, Text } from '../../src/index.js';
import start2d from '../common/start2d.js';
import { allowObject2dCanMove, object2dCanMove } from '../common/object2d_move.js';

let rect = null, circle = null, text = null;
// 测试 sat 效果
const { scene } = start2d(document.getElementById('renderCanvas'), onChangeFun);
allowObject2dCanMove(scene);

rect = new Rect({
	x: 400,
	y: 300,

	width: 300,
	height: 300,

	fill: '#ffff00',
	stroke: '#0000ff',
	strokeWidth: 0,
});
circle = new Circle({
	radius: 100,
	startAngle: 0,
	endAngle: 360,

	fill: '#ff0000',
	//fill: null,
	//strokeWidth: 1,
	//stroke: '#0000ff',
});
text = new Text({
	x: 0,
	y: 0,
	// text: 'false',
	text: 'font-size',
	fill: '#000000',
	// fill: null,
	// strokeWidth: 2,
	// stroke: '#000000',
});

scene.add(rect);
scene.add(circle);
scene.add(text);

object2dCanMove(rect);
object2dCanMove(circle);


const gui = new lil.GUI();

function onChangeFun() {
	if (text) {
		text.text = rect.isOverlap(circle) + '';
		// console.info('text.text:', text.text);
	}
}
onChangeFun();

function initTransformGui(folder, target) {
	folder.add(target, 'x', -600, 600, 0.1).onChange(onChangeFun);
	folder.add(target, 'y', -600, 600, 0.1).onChange(onChangeFun);
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
	const rectFolder = gui.addFolder('rect');
	rectFolder.close();

	rectFolder.add(rect, 'width', -600, 600).onChange(onChangeFun);
	rectFolder.add(rect, 'height', -600, 600).onChange(onChangeFun);
	rectFolder.add(rect, 'visible').onChange(onChangeFun);

	['rxlt', 'rxrt', 'ryrt', 'ryrb', 'rxrb', 'rxlb', 'rylb', 'rylt'].forEach((radius) => {
		rectFolder.add(rect, radius, 0, 150).onChange(onChangeFun);
	});
	initObject2dGui(rectFolder, rect);
}
{
	const circleFolder = gui.addFolder('circle');

	circleFolder.add(circle, 'radius', 0, 300).name('radius').onChange(onChangeFun);
	circleFolder.add(circle, 'visible').onChange(onChangeFun);
	circleFolder.close();

	initObject2dGui(circleFolder, circle);
}