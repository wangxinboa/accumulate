import GUI from '../libs/lil-gui/lil-gui.esm.js'
import initObjectGui from '../common/init_object_gui.js';


const canvasDom = document.getElementById('renderCanvas');
canvasDom.width = canvasDom.clientWidth;
canvasDom.height = canvasDom.clientHeight;

const canvas = new fabric.Canvas(canvasDom);

var img = document.createElement('img');
/** @ignore */
img.onload = function () {
	var image = new fabric.Image(img, {
		left: 200,
		top: 300,
		scaleX: 0.3,
		scaleY: 0.3,
	});
	canvas.add(image)
	img = img.onload = null;

	const gui = new GUI();

	initObjectGui(gui, image, canvas);
	initRectGui(gui, image, canvas);

};
img.src = 'http://img.china.alibaba.com/img/ibank/O1CN01i6iupn1sdsFBHERxn_!!6000000005790-0-tps-800-800.jpg'

function initRectGui(gui, image, canvas) {
	// const folder = gui.addFolder('image');
	// const onChangeFun = () => {
	//     canvas.renderAll();
	// }
	// folder.add(image, 'rx', 0, 100, 0.01).onChange(onChangeFun);
}
