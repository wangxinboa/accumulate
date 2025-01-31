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


function mousedownCircle() {
	//模拟click事件
	//获取btn
	const canvasEventDom = document.querySelectorAll(".upper-canvas")[0];
	console.clear();
	//创建event
	const event = document.createEvent("MouseEvents");
	//初始化event
	event.initMouseEvent("mousedown",
		true, true, document.defaultView, 0,
		50, 50,
		50, 50,
		false, false, false, false, 0, null);
	//触发事件
	canvasEventDom.dispatchEvent(event);
}

function mousemoveCircle() {
	//模拟click事件
	//获取btn
	const canvasEventDom = document.querySelectorAll(".upper-canvas")[0];
	console.clear();
	//创建event
	const event = document.createEvent("MouseEvents");
	//初始化event
	event.initMouseEvent("mousemove",
		true, true, document.defaultView, 0,
		500, 500,// screen
		500, 500,// client
		false, false, false, false, 0, null);
	//触发事件
	canvasEventDom.dispatchEvent(event);
}

function mouseupCircle() {
	//模拟click事件
	//获取btn
	const canvasEventDom = document.querySelectorAll(".upper-canvas")[0];
	console.clear();
	//创建event
	const event = document.createEvent("MouseEvents");
	//初始化event
	event.initMouseEvent("mouseup",
		true, true, document.defaultView, 0,
		50, 50,// screen
		50, 50,// client
		false, false, false, false, 0, null);
	//触发事件
	canvasEventDom.dispatchEvent(event);
}

setTimeout(() => {
	mousedownCircle();
}, 2000);
// setTimeout(() => {
// 	mousemoveCircle();
// }, 3000);
// setTimeout(() => {
// 	mouseupCircle();
// }, 4000);