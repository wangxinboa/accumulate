import BaseEvent from '../events/base_events.js';

export default class BaseObject extends BaseEvent {
	constructor(option = {}) {
		super();

		this.isObject = true;

		this.visible = true;

		this.parent = null;
		this.children = [];

		this.renderOrder = option.renderOrder || 0;
	}

	add(object) {
		const index = this.children.indexOf(object);
		if (index === - 1) {
			if (object.parent !== null) {
				object.parent.remove(object);
			}
			object.parent = this;
			this.children.push(object);

			// 更新全局矩阵
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