const isConsole = false;

class MarkNode {
	constructor(key = null, title = '', data = null, parent = null) {

		this.key = key;
		this.title = title;
		this.data = data;

		// 问了方便配合 ui 加上的，迟早改掉
		this.visible = this.childrenVisible = true;

		this.parent = parent;
		this.prentNotEmpty = parent;
		while (this.prentNotEmpty && this.prentNotEmpty.isEmpty() && this.prentNotEmpty.parent) {
			this.prentNotEmpty = this.prentNotEmpty.parent;
		}

		this.children = [];
	}

	addChildren(key = null, title = '', data = null) {
		const newMarkNode = new MarkNode(key, title, data, this);
		this.children.push(newMarkNode);
		return newMarkNode;
	}
	bindData(data) {
		this.data = data;
	}
	isEmpty() {
		return this.key === null;
	}

	toJSON() {
		return {
			key: this.key,
			parent: this.parent ? this.parent.key : null,
			prentNotEmpty: this.prentNotEmpty ? this.prentNotEmpty.key : null,
			children: this.children
		}
	}
}

const rootMarkNode = new MarkNode('root', 'root 根节点', null, null);
let nowMarkNode = rootMarkNode;

const MarkLog = {
	rootMarkNode,
	mark(title, key = null) {
		const finalTitle = `${title}${key === null ? '-[空节点]' : ''}-[父节点:${nowMarkNode.isEmpty() ? nowMarkNode.prentNotEmpty.key : nowMarkNode.key}]`;
		nowMarkNode = nowMarkNode.addChildren(key, finalTitle);
		if (isConsole) {
			globalThis.console.group(finalTitle);
			globalThis.console.groupCollapsed(`${title} 执行信息`);
			globalThis.console.info(nowMarkNode);
			globalThis.console.trace();
			globalThis.console.groupEnd();
		}
		return nowMarkNode;
	},
	markEnd() {
		nowMarkNode = nowMarkNode.parent;
		if (isConsole) {
			globalThis.console.groupEnd();
		}
	}
}

export default MarkLog;