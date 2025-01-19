
import '../fabric.js_mark/fabric.js_mark.js';
// import fabric from './fabric.js.modules.js';


codeMarkObject(fabric, 'fabric');
codeMarkObject(Cufon, 'Cufon');

const canvasDom = document.getElementById('renderCanvas');
canvasDom.width = canvasDom.clientWidth;
canvasDom.height = canvasDom.clientHeight;

// const canvas = new fabric.Canvas(canvasDom);
const canvas = new fabric.Element(canvasDom);

// const rect = new fabric.Rect({
// 	left: 100,
// 	top: 100,
// 	fill: 'red',
// 	width: 20,
// 	height: 20,
// 	angle: 0,

// });
// canvas.add(rect);

// var circle = new fabric.Circle({
// 	fill: 'green',
// 	radius: 30,
// 	left: 70,
// 	top: 120
// });
// canvas.add(circle);

// var polygon = new fabric.Polygon([
// 	{ x: 0, y: 0 },
// 	{ x: 20, y: 20 },
// 	{ x: 80, y: 20 },
// 	{ x: 0, y: 0 },
// ], {
// 	// fill: "red",
// 	// fill: null,
// 	stroke: 'blue',
// 	strokeWidth: 0,
// })
// canvas.add(polygon)


var text = new fabric.Text('Hello world!', {
	// fill: "red",
	fontfamily: 'delicious_500',
	left: 100,
	top: 100,
	angle: 0,
	// width: 50,
	// height: 60
});
canvas.add(text)