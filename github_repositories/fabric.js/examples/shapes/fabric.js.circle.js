import GUI from '../../../../libs/lil-gui/lil-gui.esm.js'
import initObjectGui from './init_object_gui.js';


const canvasDom = document.getElementById('renderCanvas');
canvasDom.width = canvasDom.clientWidth;
canvasDom.height = canvasDom.clientHeight;

const canvas = new fabric.Canvas(canvasDom);

const circle = new fabric.Circle({
	left: 60,
	top: 60,
	fill: '#ff0000',
	width: 100,
	height: 30,
	radius: 30,
});
canvas.add(circle);

const gui = new GUI();

initObjectGui(gui, circle, canvas);
initCircleGui(gui, circle, canvas);

function initCircleGui(gui, circle, canvas) {
	const folder = gui.addFolder('circle');
	const onChangeFun = () => {
		canvas.renderAll();
	}
	folder.add(circle, 'radius', 0, 100, 0.01).onChange(onChangeFun);
}
