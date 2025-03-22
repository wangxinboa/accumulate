import { objectSpread2 as _objectSpread2 } from '../../../_virtual/_rollupPluginBabelHelpers.mjs';

const cloneStyles = codeMarkFunction(style => {
	const newObj = {};
	Object.keys(style).forEach(key => {
		newObj[key] = {};
		Object.keys(style[key]).forEach(keyInner => {
			newObj[key][keyInner] = _objectSpread2({}, style[key][keyInner]);
		});
	});
	return newObj;
}, 'cloneStyles');

export { cloneStyles };
//# sourceMappingURL=cloneStyles.mjs.map
