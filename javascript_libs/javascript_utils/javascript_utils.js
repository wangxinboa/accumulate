import { deepClone } from './data_type/object.js';
import {
	isFunction,
	isNumber,
	isString,
	isBoolean,
	isPrimitive,
	isObject,
	isPlainObject,
	isNonArrayObject,
	deepClone,
} from './data_type/is_type.js';


const jsUtils = {
	isFunction,
	isNumber,
	isString,
	isBoolean,
	isPrimitive,
	isObject,
	isPlainObject,
	isNonArrayObject,
	deepClone,
}

globalThis.jsUtils = jsUtils;

export default jsUtils;