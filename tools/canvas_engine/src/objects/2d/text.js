import Object2D from "./base/object2d.js";

const _canvas = document.createElement('canvas');
_canvas.width = 0;
_canvas.height = 0;
const _ctx = _canvas.getContext('2d');


export default class Text extends Object2D {
	constructor(scene, option = {}) {
		super(scene, option);

		this.isText = true;

		this._text = option.text || '';
		this.fontStyle = option.fontStyle || 'normal';
		this.fontWeight = option.fontWeight || 'normal';
		this.fontSize = option.fontSize || 20;
		this.fontFamily = option.fontFamily || 'sans-serif';

		this._initDimensions();

		this.updateMatrix();
		this.updateRange();
	}

	_initDimensions() {

		this._render(_ctx);
		this.width = _ctx.measureText(this.text).width;
		this.height = this.fontSize * 1.3;
	}

	_setTextStyles(ctx) {
		//ctx.textBaseline = 'alphabetic';
		//ctx.textAlign = this.textAlign;
		ctx.font = `${this.fontStyle} ${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
	}

	_render(ctx) {
		ctx.save();
		ctx.fillStyle = '#ff00ff';
		ctx.fillRect(0, 0, this.width, this.height);
		ctx.restore();

		// ctx.textBaseline = 'top';
		// ctx.textBaseline = 'hanging';
		// ctx.textBaseline = 'top';
		// ctx.textBaseline = 'top';
		// ctx.textBaseline = 'bottom';

		ctx.beginPath();
		this._setTextStyles(ctx);
		if (this.hasFill()) {
			ctx.fillText(this.text, 0, this.fontSize);
		}
		if (this.hasStroke()) {
			ctx.strokeText(this.text, 0, this.fontSize);
		}
	}

	updateRange() {
		this.min.set(0, 0);
		this.max.set(this.width, this.height);

		this.updateRectangle();
	}

	get text() {
		return this._text;
	}
	set text(val) {
		this._text = val;
		this._initDimensions();
	}
}