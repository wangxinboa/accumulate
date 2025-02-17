import { createCanvas, destroyCanvas, showCanvas, hideCanvas, startShowCanvas } from './canvas/ui_canvas.js';
import { drawMarkNode } from './canvas/ui_canvas_draw.js';

export function initCodeAnalysisUi() {
	new UiButton();

	createCanvas();
}

export function updateCodeAnalysisUi() {
	drawMarkNode();
}

function preventDefault(e) {
	e.preventDefault();
}

export default class UiButton {
	constructor() {
		this.startMove = false;
		this.buttonRigth = 0;
		this.buttonBottom = 0;
		this.buttonWidth = 30;
		this.buttonHeight = 30;
		this.x = 0;
		this.y = 0;
		this.isShowCanvas = startShowCanvas;

		this.button = document.createElement('div');
		this.button.style.cssText = `position: absolute; width: ${this.buttonWidth}px; height: ${this.buttonHeight}px; bottom: ${this.buttonBottom}px; right: ${this.buttonRigth}px; border-radius: 50%; background-color: red; cursor: pointer; opacity: 0.3; z-index: 1;`;

		this.handleMousedown = this.handleMousedown.bind(this);
		this.handleMousemove = this.handleMousemove.bind(this);
		this.handleMouseup = this.handleMouseup.bind(this);
		this.handleDblclick = this.handleDblclick.bind(this);

		this.button.addEventListener('mousedown', this.handleMousedown);
		document.body.addEventListener('mousemove', this.handleMousemove);
		document.body.addEventListener('mouseup', this.handleMouseup);
		document.body.addEventListener('mouseleave', this.handleMouseup);

		this.button.addEventListener('dblclick', this.handleDblclick);

		document.body.appendChild(this.button);

		document.addEventListener('contextmenu', preventDefault);
	}

	handleMousedown(e) {
		e.preventDefault();

		if (e.button === 0) {
			this.startMove = true;

			this.x = e.screenX + this.buttonRigth;
			this.y = e.screenY + this.buttonBottom;
		} else if (e.button === 2) {
			drawMarkNode();
		}
	}
	handleMousemove(e) {
		e.preventDefault();

		if (this.startMove) {

			this.buttonRigth = this.x - e.screenX;
			this.buttonBottom = this.y - e.screenY;
			this.button.style.right = `${this.x - e.screenX}px`;
			this.button.style.bottom = `${this.y - e.screenY}px`;
		}
	}
	handleMouseup(e) {
		e.preventDefault();

		this.startMove = false;
	}
	handleDblclick(e) {
		e.preventDefault();

		if (this.isShowCanvas) {
			hideCanvas();
		} else {
			showCanvas();
		}
		this.isShowCanvas = !this.isShowCanvas;
	}

	destroy() {
		this.button.addEventListener('mousedown', this.handleMousedown);
		document.body.removeEventListener('mousemove', this.handleMousemove);
		document.body.removeEventListener('mouseup', this.handleMouseup);
		document.body.removeEventListener('mouseleave', this.handleMouseup);

		this.button.removeEventListener('dblclick', this.handleDblclick);

		this.handleMousedown = null;
		this.handleMousemove = null;
		this.handleMouseup = null;
		this.handleDblclick = null;

		document.body.removeChild(this.button);

		button = null;

		document.removeEventListener('contextmenu', preventDefault);

		destroyCanvas();
	}
}