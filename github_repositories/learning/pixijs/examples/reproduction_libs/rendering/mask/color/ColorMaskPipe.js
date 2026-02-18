const colorMaskPipe = {
	new(renderer) {
		this._colorStack = [];
		this._colorStackIndex = 0;
		this._currentColor = 0;
		this._renderer = renderer;
	},
	buildStart() {
		this._colorStack[0] = 15;
		this._colorStackIndex = 1;
		this._currentColor = 15;
	},
};

export default colorMaskPipe;
