import CanvasScale from './canvas_scale.js'

export default class CanvasRenderer extends CanvasScale {

	constructor(el, canvasOption) {
		super(el, canvasOption);

		this.el = el;
		this.ctx = el.getContext('2d');

		this.ctx.scale(this.retinaScaling, this.retinaScaling);
	}

	clear() {
		this.ctx.clearRect(0, 0, this.el.width, this.el.height);
	}

	render(scene, camera) {
		this.clear();

		this.ctx.save();
		camera.transform(this.ctx);

		scene.objects.forEach((object) => {
			if (object.visible) {
				object.render(this.ctx);
			}
		});
		this.ctx.restore();
	}

	destroy() {

	}
}
