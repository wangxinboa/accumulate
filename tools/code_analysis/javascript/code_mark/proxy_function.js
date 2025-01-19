import { isFunction } from '../../../../javascript_utils/data_type/is_type.js';
import MarkLogs from './mark_logs.js';

export const AllProxyFunctionMessage = {};
export const AllProxyFunctionMap = new Map();

class ProxyFunctionMessage {
	constructor(originalFunction, key) {
		this.originalFunction = originalFunction;
		this.key = key;

		this.used = 0;
		this.usedLogs = [];
		this.usedParentMap = {};
	}

	mark(title, args, resultWrapper) {
		this.used++;
		const { prentNotEmptyMarkNode } = MarkLogs.mark(title, this.key, args, resultWrapper, this);
		const { key: parentKey } = prentNotEmptyMarkNode;
		this.usedLogs.push(prentNotEmptyMarkNode);
		if (!this.usedParentMap[parentKey]) {
			this.usedParentMap[parentKey] = parentKey;
		}
	}
	markEnd() {
		MarkLogs.markEnd();
	}
	markConsole() {
		globalThis.console.info(`第 ${this.used} 次执行`);
		globalThis.console.info('markFunction:', this);
		globalThis.console.info(this.originalFunction);
	}
}

let proxyFunctionIndex = 0;
export default function proxyFunction(originalFunction, key) {
	if (AllProxyFunctionMap.has(originalFunction)) {
		return AllProxyFunctionMap.get(originalFunction);
	}

	if (AllProxyFunctionMessage[key]) {
		throw new Error(`AllProxyFunctionMessage 已经存在 ${key}`);
	}

	const markFunctionMessage = new ProxyFunctionMessage(originalFunction, key);
	const proxy = new Proxy(originalFunction, {
		construct(target, args, newTarget) {
			const resultWrapper = {};
			markFunctionMessage.mark(`${key} 初始化`, args, resultWrapper);
			let result = null;
			if (target === newTarget) {
				result = new target(...args);
			} else {
				result = Reflect.construct(target, args, newTarget);
			}
			markFunctionMessage.markEnd();
			resultWrapper.result = result;
			return result;
		},
		apply(target, thisArg, argumentsList) {
			const resultWrapper = {};
			markFunctionMessage.mark(key, argumentsList, resultWrapper);
			const result = target.call(thisArg, ...argumentsList);
			markFunctionMessage.markEnd();
			resultWrapper.result = result;
			return result;
		},
		set(target, prop, value) {
			if (isFunction(value)) {
				target[prop] = proxyFunction(value, `${key}.${prop}`);;
			} else {
				target[prop] = value;
			}
			return true;
		},
	});
	AllProxyFunctionMap.set(originalFunction, proxy);
	AllProxyFunctionMessage[key] = markFunctionMessage;

	proxyFunctionIndex++;

	return proxy;
}
