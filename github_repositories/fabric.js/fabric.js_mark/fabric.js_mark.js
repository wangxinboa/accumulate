import { isFunction, isOriginalFunction } from '../../../javascript_utils/data_type/is_type.js';
import convertClass from '../../../tools/code_analysis/javascript/code_mark/convert/convert_class.js';
import convertFunction from '../../../tools/code_analysis/javascript/code_mark/convert/convert_function.js';
import { AllProxyFunctionMessage, AllProxyFunctionMap } from '../../../tools/code_analysis/javascript/code_mark/proxy_function.js';
import MarkLogs from '../../../tools/code_analysis/javascript/code_mark/mark_logs.js';

globalThis.AllProxyFunctionMap = AllProxyFunctionMap;
globalThis.AllProxyFunctionMessage = AllProxyFunctionMessage;
globalThis.MarkLogs = MarkLogs;

globalThis.AllProxyFunctionMap = AllProxyFunctionMap;

globalThis.AllFabricJsClass = {};
globalThis.fabricJsClassMark = function fabricJsClassMark(fabricJsClass, aliasName) {
	if (!isFunction(fabricJsClass)) {
		throw new Error(`fabricJsClassMark fabricJsClass 不是函数类型`);
	}

	let className = aliasName || fabricJsClass.name;

	if (AllFabricJsClass[className]) {
		throw new Error(`fabricJsClassMark AllFabricJsClass 已存在 ${className} class`);
	}
	AllFabricJsClass[className] = fabricJsClass;
	//const aliasMessaage = phaserClassAlias[className];
	//if (aliasMessaage) {
	//	className = aliasMessaage.alias[aliasMessaage.nowIndex++];
	//}

	return convertClass(fabricJsClass, className);
}

globalThis.AllFabricJsFunction = {};
globalThis.fabricJsFunctionMark = function fabricJsFunctionMark(fabricJsFunction, aliasName) {
	const functionName = aliasName || fabricJsFunction.name;

	if (!isOriginalFunction(fabricJsFunction)) {
		throw new Error(`fabricJsFunctionMark fabricJsFunction 不是原始函数`);
	}

	if (AllFabricJsFunction[functionName]) {
		throw new Error(`fabricJsFunctionMark AllFabricJsFunction 已存在 ${functionName} function`);
	}

	AllFabricJsFunction[functionName] = fabricJsFunction;

	return convertFunction(fabricJsFunction, functionName);
}
