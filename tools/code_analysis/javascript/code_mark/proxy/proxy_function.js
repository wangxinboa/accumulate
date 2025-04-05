import { isFunction } from '../../../../../javascript_libs/javascript_utils/data_type/is_type.js';
import MarkLog from '../mark_log.js';


export const AllMarkFunctionMessage = {};
export const AllProxyFunctionMap = new Map();
export const AllOriginalFunctionMap = new Map();

class MarkFunctionMessage {
	constructor(originalFunction, key) {
		this.originalFunction = originalFunction;
		this.key = key;

		this.allArgs = [];
		this.allResult = [];

		this.used = 0;
		this.usedLog = [];
		this.parentsLog = [];
		this.parentsMap = {};
	}

	mark(title) {
		this.used++;
		const markNode = MarkLog.mark(title, this.key, this);
		this.usedLog.push(markNode);

		const { key: parentKey } = markNode.prentNotEmpty;
		this.parentsLog.push(markNode.prentNotEmpty);
		if (this.parentsMap[parentKey]) {
			this.parentsMap[parentKey]++;
		} else {
			this.parentsMap[parentKey] = 1;
		}

		return markNode;
	}
	markEnd() {
		MarkLog.markEnd();
	}

	createMarkNodeData(args, result) {
		this.allArgs.push(args);
		this.allResult.push(result);

		return {
			args, result,
			used: this.used,
			originalFunction: this.originalFunction,
			markFunctionMessage: this,
		}
	}
}

let proxyFunctionIndex = 0;

export default function proxyFunction(originalFunction, key) {
	if (AllOriginalFunctionMap.has(originalFunction)) {
		return AllOriginalFunctionMap.get(originalFunction);
	}

	if (AllProxyFunctionMap.has(originalFunction)) {
		return originalFunction;
	}

	if (AllMarkFunctionMessage[key]) {
		// console.info('originalFunction:', originalFunction);
		// console.info(`AllMarkFunctionMessage[${key}]:`, AllMarkFunctionMessage[key]);
		throw new Error(`AllMarkFunctionMessage 已经存在 ${key}`);
	}

	const markFunctionMessage = new MarkFunctionMessage(originalFunction, key);
	const proxy = new Proxy(originalFunction, {
		construct(target, args, newTarget) {
			const markNode = markFunctionMessage.mark(`${key} 初始化`);
			let result = null;
			if (target === newTarget) {
				result = new target(...args);
			} else {
				result = Reflect.construct(target, args, newTarget);
			}
			markFunctionMessage.createMarkNodeData(args, result);
			markNode.bindData(markFunctionMessage.createMarkNodeData(args, result));
			markFunctionMessage.markEnd();
			return result;
		},
		apply(target, thisArg, argumentsList) {
			const markNode = markFunctionMessage.mark(key);
			const result = target.call(thisArg, ...argumentsList);
			markNode.bindData(markFunctionMessage.createMarkNodeData(argumentsList, result));
			markFunctionMessage.markEnd();
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

	AllOriginalFunctionMap.set(originalFunction, proxy);
	AllProxyFunctionMap.set(proxy, originalFunction);
	AllMarkFunctionMessage[key] = markFunctionMessage;

	proxyFunctionIndex++;

	return proxy;
}
