const isConsole = true;

class MarkNode {
	constructor(key, parent) {

		this.key = key;
		this.parent = parent;
		this.children = [];
	}

	addChildren(key) {
		const newMarkNode = new MarkNode(key, this);
		this.children.push(newMarkNode);
		return newMarkNode;
	}
	isEmpty() {
		return this.key === null;
	}

	toJSON() {
		return {
			key: this.key,
			parent: this.parent ? this.parent.key : null,
			children: this.children
		}
	}
}

const rootMarkNode = new MarkNode('root', null);
let nowMarkNode = rootMarkNode;

const MarkLogs = {
	rootMarkNode,
	mark(title, key = null, args,message) {
		const prentMarkNode = nowMarkNode;
		let prentNotEmptyMarkNode = prentMarkNode;
		while (prentNotEmptyMarkNode.isEmpty() && prentNotEmptyMarkNode.parent) {
			prentNotEmptyMarkNode = prentNotEmptyMarkNode.parent;
		}
		nowMarkNode = nowMarkNode.addChildren(key);
		if (isConsole) {
			globalThis.console.group(`${title}${key === null ? '-[空节点]' : ''}-[父节点:${prentMarkNode.key}]`);
			if (message) {
				globalThis.console.groupCollapsed(`${title} 执行信息`);
				globalThis.console.info('执行参数:', args)
				message.markConsole();
				globalThis.console.trace();
				globalThis.console.groupEnd();
			}
		}
		return {
			prentMarkNode,
			prentNotEmptyMarkNode,
			nowMarkNode,
		};
	},
	markEnd() {
		nowMarkNode = nowMarkNode.parent;
		if (isConsole) {
			globalThis.console.groupEnd();
		}
	}
}

export default MarkLogs;