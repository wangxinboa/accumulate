import Object2D from './base/object2d.js';
import { _setTextStyles } from '../../renderer/canvas_renderer/render_text.js';

const _canvas = document.createElement('canvas');
_canvas.width = 0;
_canvas.height = 0;
const _ctx = _canvas.getContext('2d');

export default class Text extends Object2D {
	constructor(option = {}) {
		super(option);

		this.isText = true;

		this._text = option.text || '';
		this.fontStyle = option.fontStyle || 'normal';
		this.fontWeight = option.fontWeight || 'normal';
		this.fontSize = option.fontSize || 16;
		this.fontFamily = option.fontFamily || 'Courier';
		this.textBackgroundColor = option.textBackgroundColor || 'transparent';
		this.backgroundColor = option.backgroundColor || 'transparent';

		this._initDimensions();

		this.updateMatrix();
		this.updateRange();
	}

	// https://juejin.cn/post/7308697586533974056
	_initDimensions() {
		_setTextStyles(_ctx, this);
		const textMetrics = _ctx.measureText(this.text);

		this.left = textMetrics.actualBoundingBoxLeft;
		this.ascent = textMetrics.actualBoundingBoxAscent;
		this.descent = textMetrics.actualBoundingBoxDescent;

		this.width = textMetrics.actualBoundingBoxLeft + textMetrics.actualBoundingBoxRight;
		this.height = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
	}

	updateRange() {
		this.rectangle.setRectangle(0, 0, this.width, this.height, this.matrixWorld);
	}

	get text() {
		return this._text;
	}
	set text(val) {
		this._text = val;
		this._initDimensions();
	}
}