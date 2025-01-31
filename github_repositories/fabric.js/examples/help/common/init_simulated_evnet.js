
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
// }, 2000);