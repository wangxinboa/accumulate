import { isFunction } from '../../../javascript_utils/data_type/is_type.js';
import convertClass from '../../../tools/code_analysis/javascript/code_mark/convert/convert_class.js';
import convertFunction from '../../../tools/code_analysis/javascript/code_mark/convert/convert_function.js';
import { AllProxyFunctionMessage, AllProxyFunctionMap } from '../../../tools/code_analysis/javascript/code_mark/proxy_function.js';
import MarkLogs from '../../../tools/code_analysis/javascript/code_mark/mark_logs.js';

import { phaserClassCache, phaserClassAlias } from './phaser_cache.js';

globalThis.AllProxyFunctionMap = AllProxyFunctionMap;
globalThis.AllProxyFunctionMessage = AllProxyFunctionMessage;
globalThis.MarkLogs = MarkLogs;


globalThis.phaserClassCache = phaserClassCache;

globalThis.phaserClassMark = function phaserClassMark(phaserClass, aliasName) {
	let className = aliasName || phaserClass.name;
	const aliasMessaage = phaserClassAlias[className];
	if (aliasMessaage) {
		className = aliasMessaage.alias[aliasMessaage.nowIndex++];
	}

	return convertClass(phaserClass, className);
}

globalThis.phaserFunctionMark = function phaserFunctionMark(phaserFunction, aliasName) {
	const functionName = aliasName || phaserFunction.name;
	return convertFunction(phaserFunction, functionName);
}

globalThis.phaserObjectMark = function phaserObjectMark(phaserObject, objectName) {
	const markedObject = {};
	for (let key in phaserObject) {
		const fun = phaserObject[key];
		if (isFunction(fun)) {
			markedObject[key] = phaserFunctionMark(fun, `${objectName}.${key}`);
		} else {
			// throw new Error(`phaserObjectFunctionMark phaserObjectFuntion 中的 ${key} 属性值不是 function`);
		}
	}

	return markedObject;
}
