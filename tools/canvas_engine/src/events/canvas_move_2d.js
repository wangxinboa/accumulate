
export default class CanvasMove2d {
	constructor(scene, camera, onChange) {
		this.scene = scene;
		this.camera = camera;
		this.allowMove = false;

		this.onChange = onChange;
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

			if (this.onChange) {
				this.onChange();
			}
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

		if (this.onChange) {
			this.onChange();
		}
	}
	destroy() {
		// 销毁函数, 待完善
	}
}