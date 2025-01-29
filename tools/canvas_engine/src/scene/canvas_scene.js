
export default class CanvasScene {
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
		// 销毁函数, 待完善
	}
}