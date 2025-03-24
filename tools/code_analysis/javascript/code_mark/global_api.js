import { isFunction, isOriginalFunction, isObject } from '../../../../javascript_utils/data_type/is_type.js';
import convertClass from './convert/convert_class.js';
import convertFunction from './convert/convert_function.js';
import { AllMarkFunctionMessage, AllProxyFunctionMap, AllOriginalFunctionMap } from './proxy_function.js';
import MarkLog from './mark_log.js';
import CodeAnalysisUi from '../../ui/code_analysis_ui.js';

globalThis.codeAnalysisUi = new CodeAnalysisUi();

globalThis.AllProxyFunctionMap = AllProxyFunctionMap;
globalThis.AllOriginalFunctionMap = AllOriginalFunctionMap;
globalThis.AllMarkFunctionMessage = AllMarkFunctionMessage;
globalThis.MarkLog = MarkLog;

globalThis.CodeMarkAllClass = {};
globalThis.codeMarkClass = function CodeMarkClass(originalClass, aliasName) {
	if (!isFunction(originalClass)) {
		throw new Error(`codeMarkFunction originalClass 不是函数类型`);
	}

	let className = aliasName || originalClass.name;

	if (CodeMarkAllClass[className]) {
		throw new Error(`CodeMarkClass CodeMarkAllClass 已存在 ${className} class`);
	}
	CodeMarkAllClass[className] = originalClass;

	const convertedClass = convertClass(originalClass, className);
	return convertedClass;
}

globalThis.CodeMarkAllFunction = {};
globalThis.codeMarkFunction = function codeMarkFunction(originalFunction, aliasName) {
	const functionName = aliasName || originalFunction.name;

	if (!isOriginalFunction(originalFunction)) {
		throw new Error(`codeMarkFunction originalFunction 不是原始函数`);
	}

	if (CodeMarkAllFunction[functionName]) {
		// console.info('originalFunction:', originalFunction);
		throw new Error(`codeMarkFunction CodeMarkAllFunction 已存在 ${functionName} function`);
	}

	if (functionName === '') {
		// console.info('originalFunction:', originalFunction);
		throw new Error(`codeMarkFunction functionName 不能为空字符串`);
	}

	CodeMarkAllFunction[functionName] = originalFunction;

	return convertFunction(originalFunction, functionName);
}


globalThis.codeMarkObject = function codeMarkObject(originalObject, objectName) {
	const descriptors = Object.getOwnPropertyDescriptors(originalObject);

	for (let key in descriptors) {
		if (
			originalObject === window
		) {
			continue;
		} else {
			const descriptor = descriptors[key];
			if (descriptor.configurable && descriptor.writable) {
				const val = descriptor.value;
				if (isFunction(val)) {
					originalObject[key] = codeMarkClass(val, `${objectName}.${key}`);
				} else if (isObject(val)) {
					originalObject[key] = codeMarkObject(val, `${objectName}.${key}`);
				}
			}
		}
	}
	return originalObject;
}