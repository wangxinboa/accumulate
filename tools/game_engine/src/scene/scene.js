import BaseEvent from '../events/base_events.js';

export default class Scene extends BaseEvent {
	constructor() {
		super();

		this.objects = [];
		this.visibleObjects = [];
		this.visibleObjectCount = 0;

		this.camera = null;
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

	sortObjectsByOrder() {
		this.objects.sort((a, b) => {
			return a.renderOrder - b.renderOrder;
		});
	}

	addVisibleObject(object) {
		this.visibleObjects[this.visibleObjectCount] = object;
		this.visibleObjectCount++;
	}

	clearVisibleObjects() {
		this.visibleObjectCount = 0;
	}

	bindCamera(camera) {
		this.camera = camera;
	}

	destroy() {
		for (let i = this.visibleObjects.length - 1; i >= 0; i--) {
			this.visibleObjects.pop();
		}
		this.visibleObjects = null;
		this.visibleObjectCount = null;

		for (let i = this.objects.length - 1; i >= 0; i--) {
			this.removeObject(this.objects[i]);
			this.objects[i].destroy();
		}
		this.objects = null;

		this.camera = null;
	}
}