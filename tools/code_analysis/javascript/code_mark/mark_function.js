import MarkLogs from './mark_logs.js';

export const AllMarkFunction = {};

export default class MarkFunction {
	constructor(originalFunction, key) {
		if (AllMarkFunction[key]) {
			throw new Error(`AllMarkFunction 已经存在 ${key} 的 MarkFun`);
		} else {
			AllMarkFunction[key] = this;
		}

		this.originalFunction = originalFunction;
		this.key = key;

		this.used = 0;
		this.usedLogs = [];
		this.usedParentMap = {};
	}

	getMarkedFunction() {
		const markFunction = this;
		return function (...args) {
			markFunction.mark();
			const result = markFunction.originalFunction.call(this, ...args);
			markFunction.markEnd();
			return result;
		};
	}

	mark() {
		this.used++;
		const { previousMarkNodeHasMessage } = MarkLogs.mark(this.key, this);
		const { key: parentKey } = previousMarkNodeHasMessage;
		this.usedLogs.push(previousMarkNodeHasMessage);
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