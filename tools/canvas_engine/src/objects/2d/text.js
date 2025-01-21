import Object2D from "./base/object2d.js";

export default class Text extends Object2D {
	constructor(scene, option = {}) {
		super(scene, option);

		this.isText = true;

		this.text = option.text || '';
		this.fontStyle = option.fontStyle || 'normal';
		this.fontWeight = option.fontWeight || 'normal';
		this.fontSize = option.fontSize || 20;
		this.fontFamily = option.fontFamily || 'sans-serif';
	}

	_setTextStyles(ctx) {
		//ctx.textBaseline = 'alphabetic';
		//ctx.textAlign = this.textAlign;
		ctx.font = `${this.fontStyle} ${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
	}

	_render(ctx) {
		ctx.beginPath();
		this._setTextStyles(ctx);
		if (this.hasFill()) {
			ctx.fillText(this.text, 0, 0);
		}
		if (this.hasStroke()) {
			ctx.strokeText(this.text, 0, 0);
		}
	}
}