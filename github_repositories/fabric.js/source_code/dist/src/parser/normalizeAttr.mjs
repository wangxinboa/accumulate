import { attributesMap } from './constants.mjs';

const normalizeAttr = codeMarkFunction(attr => {
	var _attributesMap;
	return (_attributesMap = attributesMap[attr]) !== null && _attributesMap !== void 0 ? _attributesMap : attr;
}, 'normalizeAttr');

export { normalizeAttr };
//# sourceMappingURL=normalizeAttr.mjs.map
