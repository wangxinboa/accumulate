import { Rect, Rectangle, Object2DTransform } from '../../src/index.js';
import { allowObject2dCanMove } from '../common/object2d_move.js';
import start2d from '../common/start2d.js';

let rectangle = null, ctx = null, object2DTransform = null;
// 测试 sat 效果
const { renderer, scene } = start2d(document.getElementById('renderCanvas'), renderMatrixRect);
allowObject2dCanMove(scene);

const rect = new Rect({
	x: 400,
	y: 300,

	width: 300,
	height: 300,

	fill: '#ffff00',
	stroke: '#0000ff',
	strokeWidth: 0,
});

scene.add(rect);

const gui = new lil.GUI();

function initTransformGui(folder, target) {
	folder.add(target, 'x', -600, 600, 0.1);
	folder.add(target, 'y', -600, 600, 0.1);
	folder.add(target, 'scaleX', -10, 10);
	folder.add(target, 'scaleY', -10, 10);
	folder.add(target, 'rotationAngle', -180, 180, 1).name('rotationAngle');
}
function initObject2dGui(folder, target) {
	folder.add(target, 'strokeWidth', 0, 30, 1);
	folder.add(target, 'opacity', 0, 1, 0.01);
	initTransformGui(folder, target);
}
{
	const rectFolder = gui.addFolder('rect');
	rectFolder.close();

	rectFolder.add(rect, 'width', -600, 600);
	rectFolder.add(rect, 'height', -600, 600);
	rectFolder.add(rect, 'visible');

	['rxlt', 'rxrt', 'ryrt', 'ryrb', 'rxrb', 'rxlb', 'rylb', 'rylt'].forEach((radius) => {
		rectFolder.add(rect, radius, 0, 150);
	});
	initObject2dGui(rectFolder, rect);
}


rectangle = new Rectangle(-150, -150, 150, 150);
ctx = renderer.ctx;
object2DTransform = new Object2DTransform({
	x: 400,
	y: 300,
});
object2DTransform.updateMatrix();

function renderMatrixRect() {
	if (rectangle && ctx && object2DTransform) {
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
}
{
	const object2DTransformFolder = gui.addFolder('object2dTransform');
	object2DTransformFolder.close();

	initTransformGui(object2DTransformFolder, object2DTransform);
}