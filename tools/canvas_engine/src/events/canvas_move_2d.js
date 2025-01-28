
export default class CanvasMove2d {
	constructor(renderer, scene, camera) {
		this.renderer = renderer;
		this.scene = scene;
		this.camera = camera;
		this.allowMove = false;
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

			this.renderer.render(this.scene, this.camera);
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

		this.renderer.render(this.scene, this.camera);
	}
	destroy() {
		// 销毁函数, 待完善
	}
}