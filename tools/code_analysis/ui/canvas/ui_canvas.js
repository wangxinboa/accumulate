import { startCodeAnalysisUiCanvasDraw } from './ui_canvas_draw.js';

let canvas = null;

export const startShowCanvas = true;
const startRight = startShowCanvas ? '0' : '-100%';

export function createCanvas() {
	canvas = document.createElement('canvas');
	canvas.style.cssText = `position: absolute; bottom: 0px; right: ${startRight}; transition: right 0.3s;`;

	document.body.appendChild(canvas);

	startCodeAnalysisUiCanvasDraw(canvas);
}

export function destroyCanvas() {
	document.body.removeChild(canvas);
	canvas = null;
}

export function showCanvas() {
	canvas.style.right = '0px';
}

export function hideCanvas() {
	canvas.style.right = '-100%';
}