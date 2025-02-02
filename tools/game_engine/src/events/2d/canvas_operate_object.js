import CanvasBaseEvent from "./canvas_base_event.js";

export default class CanvasOperateObject extends CanvasBaseEvent {
	constructor(scene, camera, renderFun = () => { }) {
		super();

		this.scene = scene;
		this.camera = camera;
		this.objects = [];
		this.selectedObject = null;
		this.x = null;
		this.y = null;

		this.renderFun = renderFun;
	}

	addObject(object) {
		if (!this.objects.includes(object)) {
			this.objects.push(object);
		}
	}

	removeObject(object) {
		if (this.objects.includes(object)) {
			this.objects.splice(index, 1);
		}
	}

	mousedown(e) {
		const { offsetX: x, offsetY: y } = e;

		for (let i = this.scene.objects.length - 1; i >= 0; i--) {
			const object = this.scene.objects[i];
			if (object.containsPoint(this.camera, x, y)) {
				this.selectedObject = object;
				this.x = x;
				this.y = y;
				return false;
			}
		}
		if (this.selectedObject !== null) {
			this.selectedObject = null;
		}
		return true;
	}
	mousemove(e) {
		if (this.selectedObject !== null) {
			this.selectedObject.x += e.offsetX - this.x;
			this.selectedObject.y += e.offsetY - this.y;
			this.x = e.offsetX;
			this.y = e.offsetY;

			this.renderFun();
			return false;
		}
		return true;
	}
	mouseup() {
		if (this.selectedObject !== null) {
			this.selectedObject = null;
			return false;
		}
		return true;
	}
	mouseleave() {

		return true;
	}
	wheel(e) {

		return true;
	}
	destroy() {
		this.scene = null;
		this.camera = null;
		this.objects = null;
		this.selectedObject = null;
		this.x = null;
		this.y = null;

		this.renderFun = null;
	}
}