import GUI from '../libs/lil-gui/lil-gui.esm.js'
import '../../fabric.js_mark/fabric.js_mark.js';
import initObjectGui from '../common/init_object_gui.js';

codeMarkObject(fabric, 'fabric');

const canvasDom = document.getElementById('renderCanvas');
canvasDom.width = canvasDom.clientWidth;
canvasDom.height = canvasDom.clientHeight;

const canvas = new fabric.Canvas(canvasDom);

const rect = new fabric.Rect({
	left: 60,
	top: 20,
	fill: '#ff0000',
	width: 100,
	height: 30,
	angle: 0,
});
canvas.add(rect);

globalThis.rect = rect;

const gui = new GUI();

initObjectGui(gui, rect, canvas);
initRectGui(gui, rect, canvas);

function initRectGui(gui, rect, canvas) {
	const folder = gui.addFolder('rect');
	const onChangeFun = () => {
		canvas.renderAll();
	}
	folder.add(rect, 'rx', 0, 100, 0.01).onChange(onChangeFun);
	folder.add(rect, 'ry', 0, 100, 0.01).onChange(onChangeFun);
}
