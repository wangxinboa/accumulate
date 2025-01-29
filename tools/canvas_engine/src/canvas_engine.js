import { RenderType } from './canvas_engine_option.js';
import CanvasEvents from './events/canvas_events.js';
import CanvasMove2d from './events/canvas_move_2d.js';
import CanvasRenderer from './renderer/canvas_renderer.js';
import CanvasEngineOption from './canvas_engine_option.js';
import CanvasScene from './scene/canvas_scene.js';


export default class CanvasEngine {
	constructor(el, canvasOption = CanvasEngineOption) {
		if (canvasOption.renderType === RenderType.canvas) {
			this.renderer = new CanvasRenderer(el, canvasOption);
		} else {
			throw new Error(`CanvasEngine 未知类型的 renderType ${canvasOption.renderType}`);
		}

		this.scene = new CanvasScene();

		this.nextRenderHandle = -1;

		this.evnets = new CanvasEvents(el);

		this.evnets.addEvents('CanvasMove', new CanvasMove2d(this.scene, this.renderer.camera, () => {
			this.requestRender();
		}));

		this.afterRender = canvasOption.afterRender;
	}

	render() {
		this.renderer.render(this.scene);
	}

	requestRender() {
		if (this.nextRenderHandle === -1) {
			this.nextRenderHandle = requestAnimationFrame(() => {
				this.nextRenderHandle = -1;
				this.render();

				if (this.afterRender) {
					this.afterRender();
				}
			});
		}
	}

	destroy() {
		// 销毁函数, 待完善
	}
}