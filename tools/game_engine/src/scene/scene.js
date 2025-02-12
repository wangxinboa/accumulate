import BaseEvent from "../events/base_events.js";

export default class Scene extends BaseEvent {
	constructor() {
		super();

		this.objects = [];
		this.visibleObjectsMap = new Map();
	}

	addObject(object) {
		if (!this.objects.includes(object)) {
			this.objects.push(object);
		}
		return this;
	}

	removeObject(object) {
		const index = this.objects.indexOf(object);
		if (index !== - 1) {
			this.objects.splice(index, 1);
		}
		return this;
	}

	destroy() {
		this.visibleObjectsMap.clear();
		this.visibleObjectsMap = null;

		for (let i = this.objects.length - 1; i >= 0; i--) {
			this.removeObject(this.objects[i]);
			this.objects[i].destroy();
		}

		this.objects = null;
	}
}