const BLEND_MODE_FILTERS = {};

const blendModePipe = {
	new(renderer) {
		this._isAdvanced = false;
		this._filterHash = {};
		this._renderer = renderer;
	},
	setBlendMode(renderable, blendMode, instructionSet) {
		if (this._activeBlendMode === blendMode) {
			if (this._isAdvanced) this._renderableList.push(renderable);
			return;
		}
		this._activeBlendMode = blendMode;
		if (this._isAdvanced) {
			this._endAdvancedBlendMode(instructionSet);
		}
		this._isAdvanced = !!BLEND_MODE_FILTERS[blendMode];
		if (this._isAdvanced) {
			this._beginAdvancedBlendMode(instructionSet);
			this._renderableList.push(renderable);
		}
	},
	buildStart() {
		this._isAdvanced = false;
	},
	buildEnd(instructionSet) {
		if (this._isAdvanced) {
			this._endAdvancedBlendMode(instructionSet);
		}
	},
};

export default blendModePipe;
