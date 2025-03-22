const isFiller = codeMarkFunction(filler => {
	return !!filler && filler.toLive !== undefined;
}, 'isFiller');
const isSerializableFiller = codeMarkFunction(filler => {
	return !!filler && typeof filler.toObject === 'function';
}, 'isSerializableFiller');
const isPattern = codeMarkFunction(filler => {
	return !!filler && filler.offsetX !== undefined && 'source' in filler;
}, 'isPattern');
const isTextObject = codeMarkFunction(fabricObject => {
	return !!fabricObject && typeof fabricObject._renderText === 'function';
}, 'isTextObject');
const isPath = codeMarkFunction(fabricObject => {
	// we could use instanceof but that would mean pulling in Text code for a simple check
	// @todo discuss what to do and how to do
	return !!fabricObject && typeof fabricObject._renderPathCommands === 'function';
}, 'isPath');
const isActiveSelection = codeMarkFunction(fabricObject => !!fabricObject && 'multiSelectionStacking' in fabricObject, 'isActiveSelection');

export { isActiveSelection, isFiller, isPath, isPattern, isSerializableFiller, isTextObject };
//# sourceMappingURL=typeAssertions.mjs.map
