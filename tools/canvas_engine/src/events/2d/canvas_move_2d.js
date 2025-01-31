import CanvasBaseEvent from "./canvas_base_event.js";

export default class CanvasMove2d extends CanvasBaseEvent {
	constructor(scene, camera, renderFun = () => { }) {
		super();

		this.scene = scene;
		this.camera = camera;
		this.allowMove = false;
		this.x = 0;
		this.y = 0;

		this.renderFun = renderFun;
	}
	mousedown(e) {
		this.x = e.offsetX;
		this.y = e.offsetY;

		this.allowMove = true;
		return false;
	}
	mousemove(e) {
		if (this.allowMove) {
			this.camera.x += this.x - e.offsetX;
			this.camera.y += this.y - e.offsetY;
			this.x = e.offsetX;
			this.y = e.offsetY;

			this.renderFun();
			return false;
		}
	}
	mouseup() {
		this.allowMove = false;
		return false;
	}
	mouseleave() {
		this.allowMove = false;
		return false;
	}
	wheel(e) {
		this.camera.x += e.deltaX;
		this.camera.y += e.deltaY;

		this.renderFun();
		return false;
	}
	destroy() {
		this.scene = null;
		this.camera = null;
		this.allowMove = null;
		this.x = null;
		this.y = null;

		this.renderFun = null;
	}
}