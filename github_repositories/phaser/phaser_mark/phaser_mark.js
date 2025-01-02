import { isFunction } from '../../../javascript_utils/data_type/is_type.js';
import { phaserClassCache, phaserClassAlias } from './phaser_cache.js';
import convertClass from '../../../tools/code_analysis/javascript/code_mark/convert/convert_class.js';
import convertFunction from '../../../tools/code_analysis/javascript/code_mark/convert/convert_function.js';
import { AllMarkFunction } from '../../../tools/code_analysis/javascript/code_mark/mark_function.js';
import MarkLogs from '../../../tools/code_analysis/javascript/code_mark/mark_logs.js';

globalThis.phaserClassCache = phaserClassCache;
globalThis.AllMarkFunction = AllMarkFunction;
globalThis.MarkLogs = MarkLogs;

globalThis.phaserClassMark = function phaserClassMark(phaserClass, aliasName) {
	let className = aliasName || phaserClass.name;
	const aliasMessaage = phaserClassAlias[className];
	if (aliasMessaage) {
		className = aliasMessaage.alias[aliasMessaage.nowIndex++];
	}

	return convertClass(phaserClass, className);
}

globalThis.phaserFunMark = function phaserFunMark(phaserFun, aliasName) {
	const functionName = aliasName || phaserFun.name;
	return convertFunction(phaserFun, functionName);
}

globalThis.phaserObjectFunMark = function phaserObjectFunMark(phaserObjectFun, objectName) {
	const markedObjectFun = {};
	for (let key in phaserObjectFun) {
		const fun = phaserObjectFun[key];
		if (isFunction(fun)) {
			markedObjectFun[key] = phaserFunMark(fun, `${objectName}.${key}`);
		} else {
			// throw new Error(`phaserObjectFunMark phaserObjectFun 中的 ${key} 属性值不是 function`);
		}
	}

	return markedObjectFun;
}
