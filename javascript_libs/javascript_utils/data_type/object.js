import { isPrimitive, isFunction, isObject } from './is_type.js';

const _map_ = new Map();

export function deepClone(source) {
	const target = _deepClone(source, _map_);
	_map_.clear();
	return target;
}

function _deepClone(source, map) {
	let target = null;
	if (
		source instanceof HTMLElement ||
		isFunction(source) ||
		isPrimitive(source)
	) {
		target = source;
	} else {
		if (map.has(source)) {
			target = map.get(source);
		} else {
			if (Array.isArray(source)) {
				target = [];
				map.set(source, target);
				for (let i = 0, len = source.length; i < len; i++) {
					target.push(_deepClone(source[i], map));
				}
			} else if (isObject(source)) {
				target = {};
				map.set(source, target);
				for (let key in source) {
					target[key] = _deepClone(source[key], map);
				}
			}
		}
	}
	return target;
}