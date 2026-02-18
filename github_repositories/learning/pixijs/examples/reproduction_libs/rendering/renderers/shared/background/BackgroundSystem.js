import { Color } from "../../../../../../src/color/Color.mjs";

const backgroundSystem = {
	defaultOptions: {
		backgroundAlpha: 1,
		backgroundColor: 0,
		clearBeforeRender: true,
	},
	clearBeforeRender: true,
	alpha: 1,
	_backgroundColor: new Color(0),

	init(options) {
		options = { ...backgroundSystem.defaultOptions, ...options };

		this.clearBeforeRender = options.clearBeforeRender;
		this.color = options.background || options.backgroundColor || this._backgroundColor;
		this.alpha = options.backgroundAlpha;
		this._backgroundColor.setAlpha(options.backgroundAlpha);
	},
	get color() {
		return this._backgroundColor;
	},
	set color(value) {
		this._backgroundColor.setValue(value);
	},
	get alpha() {
		return this._backgroundColor.alpha;
	},
	set alpha(value) {
		this._backgroundColor.setAlpha(value);
	},
	get colorRgba() {
		return this._backgroundColor.toArray();
	},
};

export default backgroundSystem;
