import { FitType } from '../game_engine_option.js';
import { EmptyFunction } from '../utils/data.js';

export default class CanvasScale {
	constructor(el, canvasOption) {
		this.retinaScaling = devicePixelRatio || window.devicePixelRatio;
		this.fitType = canvasOption.fitType || FitType.fill;
		this.el = el;
		this.onResize = canvasOption.onResize || EmptyFunction;

		this.maxWidth = canvasOption.maxWidth || -1;
		this.maxHeight = canvasOption.maxHeight || -1;

		this.resize = this.resize.bind(this);
		window.addEventListener('resize', this.resize);
	}

	// windows 环境下父元素需要设置 overflow: hidden 防止滚动条的出现出现影响宽高
	resize() {
		let finalWidth = 0, finalHeight = 0;

		const parentDom = this.el.parentNode;
		const parentWidth = parentDom.clientWidth;
		const parentHeight = parentDom.clientHeight;

		if (this.fitType === FitType.fill) {
			finalWidth = this.maxWidth > 0 && parentWidth > this.maxWidth ? this.maxWidth : parentWidth;
			finalHeight = this.maxHeight > 0 && parentHeight > this.maxHeight ? this.maxHeight : parentHeight;
		} else {
			throw new Error(`CanvasFit 未知类型的 fitType ${this.fitType}`);
		}

		this.el.width = finalWidth * this.retinaScaling;
		this.el.height = finalHeight * this.retinaScaling;

		this.el.style.width = `${finalWidth}px`;
		this.el.style.height = `${finalHeight}px`;

		this.onResize(finalWidth, finalHeight);
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