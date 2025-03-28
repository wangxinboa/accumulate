import { deepClone } from './data_type/object.js';
import {
	isNumber,
	isString,
	isBoolean,
	isFunction,
	isPrimitiveFunction,
	isObject,
	isNonArrayObject
} from './data_type/is_type.js';


const jsUtils = {
	isNumber,
	isString,
	isBoolean,
	isFunction,
	isPrimitiveFunction,
	isObject,
	isNonArrayObject,

	deepClone,
}

globalThis.jsUtils = jsUtils;

export default jsUtils;