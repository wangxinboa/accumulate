
export default class CanvasMove2d {
	constructor(scene, camera, renderFun = () => { }) {
		this.scene = scene;
		this.camera = camera;
		this.allowMove = false;

		this.renderFun = renderFun;
	}
	mousedown(e) {
		this.allowMove = true;

		this.x = e.offsetX;
		this.y = e.offsetY;
	}
	mousemove(e) {
		if (this.allowMove) {
			this.camera.x += this.x - e.offsetX;
			this.camera.y += this.y - e.offsetY;
			this.x = e.offsetX;
			this.y = e.offsetY;

			this.renderFun();
		}
	}
	mouseup() {
		this.allowMove = false;
	}
	mouseleave() {
		this.allowMove = false;
	}
	wheel(e) {
		this.camera.x += e.deltaX;
		this.camera.y += e.deltaY;

		this.renderFun();
	}
	destroy() {
		this.scene = null;
		this.camera = null;
		this.allowMove = null;

		this.renderFun = null;
	}
}