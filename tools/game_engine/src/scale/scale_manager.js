import { FitType } from '../game_engine_option.js';

export default class ScaleManager {
	constructor(el, option) {
		this.el = el;
		this.retinaScaling = option.devicePixelRatio || window.devicePixelRatio;
		this.fitType = option.fitType || FitType.fill;
		this._onResize = () => { };

		this.maxWidth = option.maxWidth || -1;
		this.maxHeight = option.maxHeight || -1;

		this.width = -1;
		this.height = -1;

		this.resize = this.resize.bind(this);
		window.addEventListener('resize', this.resize);
	}

	onResize(onResize) {
		this._onResize = onResize;
	}

	// windows 环境下父元素需要设置 overflow: hidden 防止滚动条的出现出现影响宽高
	resize() {
		let finalWidth = 0, finalHeight = 0;

		const parentDom = this.el.parentNode;
		const parentWidth = parentDom.clientWidth;
		const parentHeight = parentDom.clientHeight;

		// 填满父节点
		if (this.fitType === FitType.fill) {
			finalWidth = this.maxWidth > 0 && parentWidth > this.maxWidth ? this.maxWidth : parentWidth;
			finalHeight = this.maxHeight > 0 && parentHeight > this.maxHeight ? this.maxHeight : parentHeight;
		} else {
			throw new Error(`CanvasFit 未知类型的 fitType ${this.fitType}`);
		}

		this.width = this.el.width = finalWidth * this.retinaScaling;
		this.height = this.el.height = finalHeight * this.retinaScaling;

		this.el.style.width = `${finalWidth}px`;
		this.el.style.height = `${finalHeight}px`;

		this._onResize(finalWidth, finalHeight);

		finalWidth = finalHeight = null;
	}

	destroy() {
		window.removeEventListener('resize', this.resize);

		this.el =
			this.retinaScaling =
			this.fitType =
			this._onResize =

			this.maxWidth =
			this.maxHeight =

			this.width =
			this.height =

			this.resize = null;
	}
}