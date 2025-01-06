const isFiller = fabricJsFunctionMark(filler => {
  return !!filler && filler.toLive !== undefined;
}, 'isFiller');
const isSerializableFiller = fabricJsFunctionMark(filler => {
  return !!filler && typeof filler.toObject === 'function';
}, 'isSerializableFiller');
const isPattern = fabricJsFunctionMark(filler => {
  return !!filler && filler.offsetX !== undefined && 'source' in filler;
}, 'isPattern');
const isTextObject = fabricJsFunctionMark(fabricObject => {
  return !!fabricObject && typeof fabricObject._renderText === 'function';
}, 'isTextObject');
const isPath = fabricJsFunctionMark(fabricObject => {
  // we could use instanceof but that would mean pulling in Text code for a simple check
  // @todo discuss what to do and how to do
  return !!fabricObject && typeof fabricObject._renderPathCommands === 'function';
}, 'isPath');
const isActiveSelection = fabricJsFunctionMark(fabricObject => !!fabricObject && 'multiSelectionStacking' in fabricObject, 'isActiveSelection');

export { isActiveSelection, isFiller, isPath, isPattern, isSerializableFiller, isTextObject };
//# sourceMappingURL=typeAssertions.mjs.map
