import initObjectGui from './init_object_gui.js';


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
		left: 0,
		top: 0,
		angle: 0,
		lineHeight: 1,
		// textDecoration: 'overline line-through overline',
		backgroundColor: "#ff0000",
		textBackgroundColor: '#0000ff',
		fontWeight: 'normal',
		textAlign: 'left'
	});
canvas.add(text);

const gui = new lil.GUI();
initObjectGui(gui, text, canvas);
initTextGui(gui, text, canvas);

function initTextGui(gui, text, canvas) {
	const folder = gui.addFolder('text');
	const onChangeFun = () => {
		canvas.renderAll();
	}
	folder.add(text, 'fontSize', 1, 100, 0.01).onChange(onChangeFun);
	folder.add(text, 'fontWeight', {
		'bolder': 'bolder',
		'bold': 'bold',
		'normal': 'normal',
		'lighter': 'lighter',
		'400': 400,
		'600': 600,
		'800': 800,
	}).onChange(onChangeFun);
	folder.add(text, 'fontFamily', {
		'Times New Roman': 'Times New Roman',
		'sans-serif': 'sans-serif',
		'serif': 'serif',
		'cursive': 'cursive',
	}).onChange(onChangeFun);
	folder.add(text, 'textDecoration', {
		'underline': 'underline',
		'overline': 'overline',
		'line-through': 'line-through',
		'': '',
	}).onChange(onChangeFun);
	// textShadow
	folder.add(text, 'textAlign', {
		left: 'left',
		center: 'center',
		right: 'right',
	}).onChange(onChangeFun);
	folder.add(text, 'fontStyle', {
		normal: 'normal',
		italic: 'italic',
		oblique: 'oblique',
		'': '',
	}).onChange(onChangeFun);
	folder.add(text, 'lineHeight', 0, 3).onChange(onChangeFun);
	text.strokeStyle = '#000000';
	folder.addColor(text, 'strokeStyle').onChange(onChangeFun);
	folder.add(text, 'strokeWidth', 0, 10).onChange(onChangeFun);
	folder.addColor(text, 'backgroundColor').onChange(onChangeFun);
	folder.addColor(text, 'textBackgroundColor').onChange(onChangeFun);
}
