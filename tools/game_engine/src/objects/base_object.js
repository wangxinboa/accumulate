import BaseEvent from "../events/base_events.js";

export default class BaseObject extends BaseEvent {
	constructor() {
		super();

		this.isObject = true;

		this.visible = true;

		this.parent = null;
		this.children = [];

		this.renderOrder = 0;
	}

	add(object) {
		const index = this.children.indexOf(object);
		if (index === - 1) {
			if (object.parent !== null) {
				object.parent.remove(object);
			}
			object.parent = this;
			this.children.push(object);

			// 根据全局矩阵
			this.updateMatrixWorld();
		}
		return this;
	}
	remove(object) {
		const index = this.children.indexOf(object);
		if (index !== - 1) {

			object.parent = null;
			this.children.splice(index, 1);
		}
		return this;
	}

	eachAfter(callback, that) {
		var node = this, nodes = [node], next = [], children, i, n, index = -1;
		while (node = nodes.pop()) {
			next.push(node);
			if (children = node.children) {
				for (i = 0, n = children.length; i < n; ++i) {
					nodes.push(children[i]);
				}
			}
		}
		while (node = next.pop()) {
			callback.call(that, node, ++index, this);
		}
		return this;
	}
	eachBefore(callback, that) {
		var node = this, nodes = [node], children, i, index = -1;
		while (node = nodes.pop()) {
			callback.call(that, node, ++index, this);
			if (children = node.children) {
				for (i = children.length - 1; i >= 0; --i) {
					nodes.push(children[i]);
				}
			}
		}
		return this;
	}

	destroy() {
		super.destroy();
		for (let i = this.children.length - 1; i >= 0; i--) {
			this.children[i].destroy();
		}

		this.isObject = null;

		this.visible = null;

		this.parent.remove(this);
		this.parent = null;

		this.children = null;
	}
}