
export default class Scene {
	constructor() {
		this.objects = [];
	}

	addObject(object) {
		if (!this.objects.includes(object)) {
			object.scene = this;
			this.objects.push(object);
		}
		return this;
	}

	removeObject(object) {
		if (this.objects.includes(object)) {
			object.scene = null;
			this.objects.splice(index, 1);
		}
		return this;
	}

	destroy() {
		for (let i = this.objects.length - 1; i >= 0; i--) {
			this.removeObject(this.objects[i]);
			this.objects[i].destroy();
		}

		this.objects = null;
	}
}