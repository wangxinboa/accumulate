import Object2D from "../base/object2d.js";
import MeasureText from "./measure_text.js";

export default class Text extends Object2D {
	constructor(scene, option = {}) {
		super(scene, option);

		this.isText = true;

		this._text = option.text || '';
		this.fontStyle = option.fontStyle || 'normal';
		this.fontWeight = option.fontWeight || 'normal';
		this.fontSize = option.fontSize || 16;
		this.fontFamily = option.fontFamily || 'Courier';
		this.textBackgroundColor = option.textBackgroundColor || 'transparent';
		this.backgroundColor = option.backgroundColor || 'transparent';

		MeasureText(this);

		this.updateMatrix();
		this.updateRange();
	}

	_setTextStyles(ctx) {
		// ctx.textBaseline = 'alphabetic';
		// ctx.textAlign = this.textAlign;
		ctx.font = `${this.fontStyle} ${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
	}

	_render(ctx) {
		ctx.beginPath();

		if (this.backgroundColor && this.backgroundColor !== 'transparent') {
			ctx.save();
			ctx.fillStyle = this.backgroundColor;
			ctx.fillRect(0, 0, this.width, this.height);
			ctx.restore();
		}

		this._setTextStyles(ctx);
		if (this.hasFill()) {
			ctx.fillText(this.text, 0, this.fontSize);
		}
		if (this.hasStroke()) {
			ctx.strokeText(this.text, 0, this.fontSize);
		}
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