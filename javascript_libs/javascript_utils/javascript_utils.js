import { BaseCleanUp } from "./base_class/base_clean_up.js";
import {
	isFunction,
	isNumber,
	isString,
	isBoolean,
	isPrimitive,
	isObject,
	isPlainObject,
	isNonArrayObject,
} from "./data_type/is_type.js";
import { deepClone, getValueByPath, setValueByPath } from "./data_type/object.js";
import { downloadFile } from "./file/download.js";
import { Loader } from "./loader/loader.js";
import { ControlledConsoleTime, ControlledConsoleTimeEnd } from "./performance_monitoring/controlled_console_time.js";
import { throttle } from "./timer/throttle.js";
import { debounce } from "./timer/debounce.js";
import { now } from "./timer/now.js";
import { TweenManager } from "./tween_manager/tween_manager.js";
import { getInitUrlSearchParam } from "./url/get_url_search_param.js";
import { copyTextToClipboard, readTextFromClipboard } from "./clipboard.js";
import { CustomMap } from "./custom_map.js";
import { DefaultVariable } from "./default_variable.js";

export {
	BaseCleanUp,
	isFunction,
	isNumber,
	isString,
	isBoolean,
	isPrimitive,
	isObject,
	isPlainObject,
	isNonArrayObject,
	deepClone,
	getValueByPath,
	setValueByPath,
	downloadFile,
	Loader,
	ControlledConsoleTime,
	ControlledConsoleTimeEnd,
	throttle,
	debounce,
	now,
	TweenManager,
	getInitUrlSearchParam,
	copyTextToClipboard,
	readTextFromClipboard,
	CustomMap,
	DefaultVariable,
};

const jsUtils = {
	BaseCleanUp,
	isFunction,
	isNumber,
	isString,
	isBoolean,
	isPrimitive,
	isObject,
	isPlainObject,
	isNonArrayObject,
	deepClone,
	getValueByPath,
	setValueByPath,
	downloadFile,
	Loader,
	ControlledConsoleTime,
	ControlledConsoleTimeEnd,
	throttle,
	debounce,
	now,
	TweenManager,
	getInitUrlSearchParam,
	copyTextToClipboard,
	readTextFromClipboard,
	CustomMap,
	DefaultVariable,
};
globalThis.jsUtils = jsUtils;

export default jsUtils;
