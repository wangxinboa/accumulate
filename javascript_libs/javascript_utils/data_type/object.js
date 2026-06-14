import { isPrimitive, isFunction, isObject } from "./is_type.js";

const _map_ = new Map();

/**
 * @param {Record<string, any>} source
 */
export function deepClone(source) {
	const target = _deepClone(source, _map_);
	_map_.clear();
	return target;
}

/**
 * @param {any} source
 * @param {Map<any, any>} map
 */
function _deepClone(source, map) {
	/** @type {string | any[] | Record<string, any> | null} */
	let target = null;
	if (source instanceof HTMLElement || isFunction(source) || isPrimitive(source)) {
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

/**
 * 根据路径数组从对象中取值
 * @param {Object} obj - 源对象
 * @param {Array<string|number>} path - 属性路径数组，如 ['position', 'x']
 * @returns {*} 目标值，若路径无效则返回 undefined
 */
export function getValueByPath(obj, path) {
	// 非对象或路径非法时直接返回 undefined
	if (obj === null || typeof obj !== "object" || !Array.isArray(path)) {
		return undefined;
	}
	/** @type {any} */
	let current = obj;
	for (let i = 0, len = path.length; i < len; i++) {
		const key = path[i];
		// 如果当前节点为 null/undefined 或不是对象，则无法继续访问
		if (current === null || typeof current !== "object") {
			return undefined;
		}
		// 检查属性是否存在（可选，不检查会直接返回 undefined）
		if (!(key in current)) {
			return undefined;
		}
		current = current[key];
	}
	return current;
}

/**
 * 严格模式：按路径数组设置值，中间节点必须已存在且为对象/数组，否则报错
 * @param {Object} obj - 目标对象
 * @param {Array<string|number>} path - 属性路径数组，如 ['position', 'x']
 * @param {*} value - 要设置的值
 * @returns {Object} 返回原对象（已修改）
 */
export function setValueByPath(obj, path, value) {
	if (obj === null || typeof obj !== "object") {
		throw new TypeError("First argument must be a non-null object");
	}
	if (!Array.isArray(path)) {
		throw new TypeError("Path must be an array");
	}
	if (path.length === 0) {
		throw new Error("Path must not be empty");
	}

	/** @type {any} */
	let current = obj;

	// 遍历到路径的倒数第二项
	for (let i = 0; i < path.length - 1; i++) {
		const key = path[i];

		const next = current[key];
		if (next === null || typeof next !== "object") {
			throw new Error(
				`Path error: property "${key}" is ${next === null ? "null" : typeof next}, expected object or array`,
			);
		}
		current = next;
	}

	// 设置最后一个键的值
	current[path[path.length - 1]] = value;

	return obj;
}
