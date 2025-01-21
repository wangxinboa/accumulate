
export default class CanvasScene {
	constructor() {
		this.objects = [];
	}

	addObject(object) {
		if (!this.objects.includes(object)) {
			object.scene = this;
			this.objects.push(object);
			// 新增的 object 都要更新矩阵
			object.updateMatrix();
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
}