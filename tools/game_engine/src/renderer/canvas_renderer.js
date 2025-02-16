import CanvasScale from './canvas_scale.js'

export default class CanvasRenderer extends CanvasScale {
	constructor(el, canvasOption) {
		super(el, canvasOption);

		this.ctx = el.getContext('2d');

		this.backgroundColor = canvasOption.backgroundColor || '';

		this.resize();
	}

	clear() {
		this.ctx.clearRect(0, 0, this.el.width, this.el.height);
	}

	resize() {
		super.resize();

		this.ctx.scale(this.retinaScaling, this.retinaScaling);
	}

	render(scene, camera) {
		this.clear();

		if (this.backgroundColor) {
			this.ctx.fillStyle = this.backgroundColor;
			this.ctx.fillRect(0, 0, this.el.width, this.el.height);
		}

		this.ctx.save();
		camera.transform(this.ctx);

		scene.clearVisibleObjects();

		scene.objects.forEach((object) => {
			if (object.visible && object.isOverlap(camera)) {
				object.render(this.ctx);
				scene.addVisibleObject(object);
			}
		});

		// 测试代码，验证相机范围矩形边
		// this.ctx.save();
		// this.ctx.lineWidth = 6;
		// this.ctx.strokeStyle = '#000000'
		// const { leftTop, rightTop, rightBottom, leftBottom } = camera.rectangle;
		// this.ctx.beginPath();
		// this.ctx.moveTo(leftTop.x, leftTop.y);
		// this.ctx.lineTo(rightTop.x, rightTop.y);
		// this.ctx.lineTo(rightBottom.x, rightBottom.y);
		// this.ctx.lineTo(leftBottom.x, leftBottom.y);
		// this.ctx.closePath();
		// this.ctx.stroke();
		// this.ctx.restore();

		this.ctx.restore();
	}

	destroy() {
		super.destroy();

		this.ctx = null;
	}
}
