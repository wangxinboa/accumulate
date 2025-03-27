import UiPanel from './panel/ui_panel.js';
import { drawMarkNode } from './canvas/ui_canvas_draw.js';

export default class CodeAnalysisUi {

	constructor() {
		this.panel = new UiPanel();

		this.switch = document.createElement('div');
		this.switch.style = 'position: fixed; right: 0px; bottom: 20px; padding: 4px 10px; border-radius: 4px; background-color: rgba(125, 125, 125, 0.6); font-size: 14px; cursor: pointer; box-shadow: rgba(0, 0, 0, 0.4) 0px 0px 10px; z-index: 2001;';
		this.switch.innerText = 'CodeAnalysisUi';
		document.body.appendChild(this.switch);

		this.switchDown = this.switchDown.bind(this);
		this.switch.addEventListener('mousedown', this.switchDown);
	}

	switchDown(e) {
		e.preventDefault();
		e.stopPropagation();

		if (this.panel.isShow) {
			this.panel.hide();
		} else {
			this.panel.show();
			drawMarkNode();
		}
	}

	destroy() {

	}
}