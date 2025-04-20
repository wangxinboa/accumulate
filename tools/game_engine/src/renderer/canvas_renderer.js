import Text from '../objects/2d/text.js';

import renderShape from './canvas_renderer/render_shape.js';
import renderText from './canvas_renderer/render_text.js';

export default class CanvasRenderer {
	constructor(el, option) {

		this.el = el;
		this.ctx = el.getContext('2d');

		this.backgroundColor = option.backgroundColor || '';
	}

	clear() {
		this.ctx.clearRect(0, 0, this.el.width, this.el.height);
	}

	resize(width, height, retinaScaling) {
		this.ctx.scale(retinaScaling, retinaScaling);
	}

	render(scene, time) {
		this.clear();

		if (this.backgroundColor) {
			this.ctx.fillStyle = this.backgroundColor;
			this.ctx.fillRect(0, 0, this.el.width, this.el.height);
			// 默认白色
			this.ctx.fillStyle = "#000000";
		}

		this.ctx.save();

		scene.camera.updateMatrix();
		this.transform(scene.camera.matrixWorld);

		scene.clearVisibleObjects();
		this._renderObject(scene, scene.root, time);

		// 测试代码，验证相机范围矩形边
		// this.ctx.save();
		// this.ctx.lineWidth = 6;
		// this.ctx.strokeStyle = '#000000'
		// const { leftTop, rightTop, rightBottom, leftBottom } = scene.camera.rectangle;
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

	_renderObject(scene, obejct, time) {
		let child = null;
		for (let i = 0, len = obejct.children.length; i < len; i++) {
			child = obejct.children[i];
			if (child.visible) {
				child.update(time);
				child.updateMatrix();
				if (child.applyCameraTransform) {
					if (scene.camera.viewInCamera(child)) {

						this._drawPrimitive(child);
						scene.addVisibleObject(child);

						this._renderObject(scene, child, time);
					}
				} else {
					if (scene.camera.viewInScreen(child)) {
						this.ctx.save();
						scene.camera.invertTransform(this.ctx);

						this._drawPrimitive(child);
						scene.addVisibleObject(child);

						this._renderObject(scene, child, time);
						this.ctx.restore();
					}
				}
			}
		}
		child = null;
	}

	_drawPrimitive(object) {
		if (object instanceof Text) {
			renderText(this.ctx, object);
		} else {
			renderShape(this.ctx, object);
		}
	}

	transform(matrix) {
		let elements = matrix.elements;
		if (
			elements[0] !== 1 ||
			elements[1] !== 0 ||
			elements[2] !== 0 ||
			elements[3] !== 0 ||
			elements[4] !== 1 ||
			elements[5] !== 0 ||
			elements[6] !== 0 ||
			elements[7] !== 0 ||
			elements[8] !== 1
		) {
			// a c e
			// b d f
			// 0 0 1
			this.ctx.transform(
				elements[0], elements[1],
				elements[3], elements[4],
				elements[6], elements[7]
			);
		}
		elements = null;
	}

	destroy() {
		super.destroy();

		this.el =
			this.ctx =
			this.backgroundColor = null;

		delete this.el;
		delete this.ctx;
		delete this.backgroundColor;
	}
}
