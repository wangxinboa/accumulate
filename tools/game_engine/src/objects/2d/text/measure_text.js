
const StandardHeightText = '|MÃ‰qgy';

const _canvas = document.createElement('canvas');
_canvas.width = 0;
_canvas.height = 0;
const _ctx = _canvas.getContext('2d');


// copy from phaser/src/gameobjects/text/MeasureText.js
export default function MeasureText(text) {
	text._setTextStyles(_ctx);
	text.width = _ctx.measureText(text.text).width;

	// this.height = this.fontSize * 1.3;

	const { actualBoundingBoxAscent, actualBoundingBoxDescent } = _ctx.measureText(StandardHeightText);
	text.height = actualBoundingBoxAscent + actualBoundingBoxDescent;
}