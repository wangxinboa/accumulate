import initObjectGui from './init_object_gui.js';


const canvasDom = document.getElementById('renderCanvas');
canvasDom.width = canvasDom.clientWidth;
canvasDom.height = canvasDom.clientHeight;

const canvas = new fabric.Canvas(canvasDom);

var polygon = new fabric.Polygon([
	{ x: 200 + 0, y: 0 },
	{ x: 200 + 20, y: 20 },
	{ x: 200 + 80, y: 20 },
	{ x: 200 + 0, y: 0 },
], {
	// fill: "red",
	// fill: null,
	stroke: 'blue',
	strokeWidth: 0,
});
canvas.add(polygon);

globalThis.polygon = polygon;

const gui = new lil.GUI();

initObjectGui(gui, polygon, canvas);
initPolygonGui(gui, polygon, canvas);

function initPolygonGui(gui, polygon, canvas) {
	// const folder = gui.addFolder('polygon');
	// const onChangeFun = () => {
	//     canvas.renderAll();
	// }
	// folder.add(circle, 'radius', 0, 100, 0.01).onChange(onChangeFun);
}
