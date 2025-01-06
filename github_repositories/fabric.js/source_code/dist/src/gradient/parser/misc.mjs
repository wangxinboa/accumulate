const parseType = fabricJsFunctionMark(function parseType(el) {
  return el.nodeName === 'linearGradient' || el.nodeName === 'LINEARGRADIENT' ? 'linear' : 'radial';
})
const parseGradientUnits = fabricJsFunctionMark(function parseGradientUnits(el) {
  return el.getAttribute('gradientUnits') === 'userSpaceOnUse' ? 'pixels' : 'percentage';
})

export { parseGradientUnits, parseType };
//# sourceMappingURL=misc.mjs.map
