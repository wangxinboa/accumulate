import { Rect, Rectangle, Object2DTransform } from '../../src/index.js';
import start, { renderer, scene } from '../common/start.js';

// 测试canvas矩阵变化和直接计算顶点绘制是否一致
start(renderMatrixRect);

const rect = new Rect(scene, {
	x: 400,
	y: 300,

	width: 300,
	height: 300,

	fill: '#ffff00',
	stroke: '#0000ff',
	strokeWidth: 0,
});

const gui = new lil.GUI();

function onChangeFun() { }

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


const rectangle = new Rectangle(-150, -150, 150, 150);
const ctx = renderer.ctx;
const object2DTransform = new Object2DTransform({
	x: 400,
	y: 300,
});
object2DTransform.updateMatrix();

function renderMatrixRect() {
	rectangle.applyMatrix3(object2DTransform.matrixWorld);

	ctx.save();
	ctx.globalAlpha = 1;
	ctx.lineWidth = 0;
	ctx.fillStyle = '#ff0000';
	ctx.beginPath();
	ctx.moveTo(rectangle.leftTop.x, rectangle.leftTop.y);
	ctx.lineTo(rectangle.rightTop.x, rectangle.rightTop.y);
	ctx.lineTo(rectangle.rightBottom.x, rectangle.rightBottom.y);
	ctx.lineTo(rectangle.leftBottom.x, rectangle.leftBottom.y);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
	ctx.restore();
}
{
	const object2DTransformFolder = gui.addFolder('object2DTransform');
	object2DTransformFolder.close();

	initTransformGui(object2DTransformFolder, object2DTransform);
}

onChangeFun();