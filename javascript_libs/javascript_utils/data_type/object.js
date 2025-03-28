import { isNonArrayObject } from './is_type.js';

export function deepClone(source) {
	let map = new Map();
	const target = _deepClone(source, map);
	map.clear();
	map = null;
	return target;
}

function _deepClone(source, map) {
	let target = null;
	if (isNonArrayObject(source)) {
		map.set(source, map);
		target = {};
		for (let key in source) {
			target[key] = _deepClone(source, map);
		}
	} else if (Array.isArray(source)) {
		target = [];
		for (let i = 0, len = obj.length; i < len; i++) {
			target.push(_deepClone(source, map));
		}
	} else {
		target = source;
	}

	return target;
}