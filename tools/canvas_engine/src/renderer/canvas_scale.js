import { FitType } from "../canvas_engine_option.js";
import Camera2d from "../camera/camera2d.js";

export default class CanvasScale {
	constructor(el, canvasOption) {
		this.retinaScaling = devicePixelRatio || window.devicePixelRatio;
		this.fitType = canvasOption.fitType || FitType.fill;
		this.camera = new Camera2d();

		this.el = el;

		this.resize();
	}

	resize() {
		const parentDom = this.el.parentNode;
		const parentWidth = parentDom.scrollWidth;
		const parentHeight = parentDom.scrollHeight;

		if (this.fitType === FitType.fill) {
			this.camera.setRange(parentWidth, parentHeight);

			this.el.width = parentWidth * this.retinaScaling;
			this.el.height = parentHeight * this.retinaScaling;

			this.el.style.width = `${parentWidth}px`;
			this.el.style.height = `${parentHeight}px`;
		} else {
			throw new Error(`CanvasFit 未知类型的 fitType ${this.fitType}`);
		}
	}
}