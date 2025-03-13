import { startCodeAnalysisUiCanvasDraw, drawMarkNode } from '../canvas/ui_canvas_draw.js';

export default class UiPanel {
	constructor() {
		this.isShow = false;
		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);

		this.mask = document.createElement('div');
		this.mask.style = 'position: fixed; left: 0px; top: 0px; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0); z-index: 2000; opacity: 1; transition: background-color 0.3s; overflow: hidden; pointer-events: none;';
		this.mask.addEventListener('mousedown', this.hide);
		document.body.appendChild(this.mask);

		this.panel = document.createElement('div');
		this.panel.style = 'position: fixed; min-height: 85%; left: 0; right: 0; bottom: -100%; background-color: #191919; transition: bottom 0.3s;';
		this.panel.addEventListener('mousedown', this.panelDown);
		this.mask.append(this.panel);

		const canvas = document.createElement('canvas');
		canvas.style.cssText = `position: absolute; bottom: 0px; right: 0; transition: right 0.3s;`;

		this.panel.appendChild(canvas);
		startCodeAnalysisUiCanvasDraw(canvas);
	}

	panelDown(e) {
		e.stopPropagation();
	}

	show() {
		this.isShow = true;

		this.mask.style['pointer-events'] = 'initial';
		this.mask.style['background-color'] = 'rgba(0, 0, 0, 0.6)';
		this.panel.style.bottom = '0';

		drawMarkNode();
	}

	hide() {
		this.isShow = false;

		this.mask.style['pointer-events'] = 'none';
		this.mask.style['background-color'] = 'rgba(0, 0, 0, 0)';
		this.panel.style.bottom = '-100%';
	}

	destroy() {

	}
}