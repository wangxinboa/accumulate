import '../fabric.js_mark/fabric.js_mark.js';
// import fabric from './fabric.js.modules.js';


codeMarkObject(fabric, 'fabric');

const canvasDom = document.getElementById('renderCanvas');
canvasDom.width = canvasDom.clientWidth;
canvasDom.height = canvasDom.clientHeight;

const canvas = new fabric.Canvas(canvasDom);
// canvas.isDrawingMode = true;


// const rect = new fabric.Rect({
// 	left: 60,
// 	top: 20,
// 	fill: 'red',
// 	width: 100,
// 	height: 30,
// 	angle: 0,
// });
// canvas.add(rect);


// var circle = new fabric.Circle({
// 	fill: 'green',
// 	radius: 30,
// 	left: 30,
// 	top: 150
// });
// canvas.add(circle);


// var polygon = new fabric.Polygon([
// 	{ x: 200 + 0, y: 0 },
// 	{ x: 200 + 20, y: 20 },
// 	{ x: 200 + 80, y: 20 },
// 	{ x: 200 + 0, y: 0 },
// ], {
// 	// fill: "red",
// 	// fill: null,
// 	stroke: 'blue',
// 	strokeWidth: 0,
// });
// canvas.add(polygon);


var text = new fabric.Text(
	'Hello world!\nAAA\nBBB',
	// 'Hello world!',
	{
		textDecoration: 'overline line-through overline',
		backgroundColor: "red",
		textBackgroundColor: 'blue',
		// strokeStyle: 'red',
		strokeWidth: 0,
		left: 160,
		top: 300,
		angle: 0,
		fontWeight: 'normal',
		// lineHeight: 3,
		// width: 50,
		// height: 60,
		textAlign: 'left'
	});
canvas.add(text)


// var img = document.createElement('img');
// /** @ignore */
// img.onload = function() {
// 	var image = new fabric.Image(img, {
// 		// fill: "red",
// 		// fontfamily: 'delicious_500',
// 		left: 200,
// 		top: 300,
// 		// width: 100,
// 		// height: 100,
// 		scaleX: 0.3,
// 		scaleY: 0.3,
// 	});
// 	canvas.add(image)
//   img = img.onload = null;
// };
// img.src = 'http://img.china.alibaba.com/img/ibank/O1CN01i6iupn1sdsFBHERxn_!!6000000005790-0-tps-800-800.jpg'


// var triangle = new fabric.Triangle({
// 	fill: "red",
// 	// fontfamily: 'delicious_500',
// 	left: 150,
// 	top: 500,
// 	width: 300,
// 	height: 100,
// });
// canvas.add(triangle)


// setTimeout(() => {
// 	//模拟click事件
// 	//获取btn
// 	const canvasEventDom = document.querySelectorAll("#renderCanvas")[0];
// 	// console.info('canvasEventDom:', canvasEventDom);
// 	console.clear();
// 	//创建event
// 	const event = document.createEvent("MouseEvents");
// 	//初始化event
// 	event.initMouseEvent("mousedown",
// 		true, true, document.defaultView, 0,
// 		50, 50,
// 		0, 0,
// 		false, false, false, false, 0, null);
// 	//触发事件
// 	canvasEventDom.dispatchEvent(event); //hello
// }, 300);

