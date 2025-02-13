import { FitType } from "../game_engine_option.js";
import { EmptyFunction } from "../utils/data.js";

export default class CanvasScale {
	constructor(el, canvasOption) {
		this.retinaScaling = devicePixelRatio || window.devicePixelRatio;
		this.fitType = canvasOption.fitType || FitType.fill;
		this.el = el;
		this.onResize = canvasOption.onResize || EmptyFunction;

		this.resize = this.resize.bind(this);
		window.addEventListener('resize', this.resize);
	}

	resize() {
		const parentDom = this.el.parentNode;
		const parentWidth = parentDom.clientWidth;
		const parentHeight = parentDom.clientHeight;

		if (this.fitType === FitType.fill) {
			this.el.width = parentWidth * this.retinaScaling;
			this.el.height = parentHeight * this.retinaScaling;

			this.el.style.width = `${parentWidth}px`;
			this.el.style.height = `${parentHeight}px`;
		} else {
			throw new Error(`CanvasFit 未知类型的 fitType ${this.fitType}`);
		}

		this.onResize(parentWidth, parentHeight);
	}

	destroy() {
		this.retinaScaling = null;
		this.fitType = null;
		this.el = null;
		this.onResize = null;

		window.removeEventListener('resize', this.resize);
		this.resize = null;
	}
}