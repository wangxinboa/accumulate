import AnimationManager from '../animation/animation_manager.js';

let id = 0;

export default class BaseObject extends AnimationManager {
	constructor(option = {}) {
		super();

		this.id = id++;
		this.isObject = true;

		this.parent = null;
		this.children = [];

		this.visible = true;
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

			this.afterAddChild();
		}
		return this;
	}

	afterAddChild() { }

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
		this.parent.remove(this);

		this.id =
			this.isObject =

			this.parent =
			this.children =

			this.visible =
			this.renderOrder = null;

		delete this.id;
		delete this.isObject;

		delete this.parent;
		delete this.children;

		delete this.visible;
		delete this.renderOrder;
	}
}