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
} from "./data_type/is_type.js";
import { deepClone } from "./data_type/object.js";
import throttle from "./timer/throttle.js";
import debounce from "./timer/debounce.js";
import now from "./timer/now.js";
import { copyTextToClipboard, readTextFromClipboard } from "./clipboard.js";

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
	throttle,
	debounce,
	now,
	copyTextToClipboard,
	readTextFromClipboard,
};

globalThis.jsUtils = jsUtils;

export default jsUtils;
