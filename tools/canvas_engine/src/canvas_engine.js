import { RenderType } from './canvas_engine_option.js';
import CanvasEvents from './events/canvas_events.js';
import CanvasMove2d from './events/2d/canvas_move_2d.js';
import CanvasOperateObject from './events/2d/canvas_operate_object.js';
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

		const renderFun = () => {
			this.requestRender();
		};
		this.evnets.addEvents('CanvasMove', new CanvasOperateObject(this.scene, renderFun));
		this.evnets.addEvents('CanvasOperateObject', new CanvasMove2d(this.scene, this.renderer.camera, renderFun));

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

	// 测试函数，打印目前在相机内的元素信息
	// testConsoleObjectsInCamera() {
	// 	this.scene.objects.forEach((object) => {
	// 		if (object.visible && object.isOverlap(this.renderer.camera)) {
	// 			console.info('object:', object);
	// 		}
	// 	});
	// }

	destroy() {
		this.renderer.destroy();
		this.renderer = null;

		this.scene.destroy();
		this.scene = null;

		this.nextRenderHandle = null;

		this.evnets.destroy();
		this.evnets = null;

		this.afterRender = null;
	}
}