

const isConsole = true;

class MarkNode {
	constructor(key, parent, message = null) {

		this.key = key;
		this.parent = parent;
		this.children = [];
		this.message = message;
	}

	addChildren(key, message) {
		const newMarkNode = new MarkNode(key, this, message);
		this.children.push(newMarkNode);
		return newMarkNode;
	}
	isEmpty() {
		return this.message === null;
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
	mark(key, message) {
		if (isConsole) {
			globalThis.console.group(`${key}${message === null ? '-(空节点)' : ''}`);
			if (message) {
				globalThis.console.groupCollapsed(`${key} 执行信息`);
				message.markConsole();
				globalThis.console.trace();
				globalThis.console.groupEnd();
			}
		}
		const previousMarkNode = nowMarkNode;
		let previousMarkNodeHasMessage = previousMarkNode;
		while (previousMarkNodeHasMessage.isEmpty() && previousMarkNodeHasMessage.parent) {
			previousMarkNodeHasMessage = previousMarkNodeHasMessage.parent;
		}
		nowMarkNode = nowMarkNode.addChildren(key, message);
		return {
			previousMarkNode,
			previousMarkNodeHasMessage,
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