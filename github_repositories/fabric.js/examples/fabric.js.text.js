import GUI from './libs/lil-gui/lil-gui.esm.js'
import '../fabric.js_mark/fabric.js_mark.js';

codeMarkObject(fabric, 'fabric');

const canvasDom = document.getElementById('renderCanvas');
canvasDom.width = canvasDom.clientWidth;
canvasDom.height = canvasDom.clientHeight;

const canvas = new fabric.Canvas(canvasDom);

const text = new fabric.Text(
	'Hello world!\nAAA\nBBB',
	// 'Hello world!',
	{
		originX: 'left',
		originY: 'top',
		strokeWidth: 0,
		left: 1,
		top: 1,
		angle: 0,

		textDecoration: 'overline line-through overline',
		backgroundColor: "red",
		textBackgroundColor: 'blue',
		fontWeight: 'normal',
		textAlign: 'left'
	});
canvas.add(text);

globalThis.text = text;

// setTimeout(() => {
//     //模拟click事件
//     //获取btn
//     const canvasEventDom = document.querySelectorAll("#renderCanvas")[0];
//     // console.info('canvasEventDom:', canvasEventDom);
//     console.clear();
//     //创建event
//     const event = document.createEvent("MouseEvents");
//     //初始化event
//     event.initMouseEvent("mousedown",
//         true, true, document.defaultView, 0,
//         50, 50,
//         0, 0,
//         false, false, false, false, 0, null);
//     //触发事件
//     canvasEventDom.dispatchEvent(event); //hello
// }, 2000);

const gui = new GUI();


const textFolder = gui.addFolder('text');
initObjectGui(textFolder, text, canvas);

function initObjectGui(folder, object, canvas) {
	const onChangeFun = () => {
		canvas.renderAll();
	}
	// 公共
	folder.add(object, 'originX', {
		left: 'left',
		center: 'center',
		right: 'right',
	}).onChange(onChangeFun);
	folder.add(object, 'originY', {
		top: 'top',
		center: 'center',
		bottom: 'bottom',
	}).onChange(onChangeFun);
	folder.add(object, 'top', 0, 500, 1).onChange(onChangeFun);
	folder.add(object, 'left', 0, 500, 1).onChange(onChangeFun);

	folder.add(object, 'scaleX', 0, 10, 0.1).onChange(onChangeFun);
	folder.add(object, 'scaleY', 0, 10, 0.1).onChange(onChangeFun);
	folder.add(object, 'flipX').onChange(onChangeFun);
	folder.add(object, 'flipY', 0, 1).onChange(onChangeFun);
	folder.add(object, 'opacity', 0, 1, 0.01).onChange(onChangeFun);
	folder.add(object, 'angle', -180, 180, 1).onChange(onChangeFun);
	folder.add(object, 'cornerSize', 0, 100).onChange(onChangeFun);
	folder.add(object, 'transparentCorners').onChange(onChangeFun);
	folder.add(object, 'padding', -100, 100).onChange(onChangeFun);
	folder.addColor(object, 'borderColor').onChange(onChangeFun);
	folder.addColor(object, 'cornerColor').onChange(onChangeFun);
	folder.addColor(object, 'fill').onChange(onChangeFun);
	folder.addColor(object, 'fillRule', {
		"source-over": "source-over",
		"source-in": "source-in",
		"source-out": "source-out",
		"source-atop": "source-atop",
		"destination-over": "destination-over",
		"destination-in": "destination-in",
		"destination-out": "destination-out",
		"destination-atop": "destination-atop",
		"lighter": "lighter",
		"copy": "copy",
		"xor": "xor",
		"multiply": "multiply",
		"screen": "screen",
		"overlay": "overlay",
		"darken": "darken",
		"lighten": "lighten",
		"color-dodge": "color-dodge",
		"color-burn": "color-burn",
		"hard-light": "hard-light",
		"soft-light": "soft-light",
		"difference": "difference",
		"exclusion": "exclusion",
		"hue": "hue",
		"saturation": "saturation",
		"color": "color",
		"luminosity": "luminosity",
	}).onChange(onChangeFun);
	folder.addColor(object, 'fill').onChange(onChangeFun);
	folder.addColor(object, 'fill').onChange(onChangeFun);
	folder.add(object, 'strokeWidth', 0, 30, 1).onChange(onChangeFun);
	// strokeDashArray
	// shadow
	folder.add(object, 'borderOpacityWhenMoving', 0, 1, 0.01).onChange(onChangeFun);
	folder.add(object, 'borderScaleFactor', -10, 10, 0.1).onChange(onChangeFun);
	// transformMatrix
	folder.add(object, 'minScaleLimit', -10, 10, 0.1).onChange(onChangeFun);
	folder.add(object, 'selectable').onChange(onChangeFun);
	folder.add(object, 'visible').onChange(onChangeFun);
	folder.add(object, 'hasControls').onChange(onChangeFun);
	folder.add(object, 'hasBorders').onChange(onChangeFun);
	folder.add(object, 'hasRotatingPoint').onChange(onChangeFun);
	folder.add(object, 'rotatingPointOffset', 0, 100).onChange(onChangeFun);
	folder.add(object, 'perPixelTargetFind').onChange(onChangeFun);
	folder.add(object, 'includeDefaultValues').onChange(onChangeFun);
	// clipTo
}
