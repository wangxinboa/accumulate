import CanvasEvents from './events/canvas_events.js';
import CanvasMove2d from './events/2d/canvas_move_2d.js';
import CanvasOperateObject from './events/2d/canvas_operate_object.js';
import CanvasRenderer from './renderer/canvas_renderer.js';
import GameEngineOption, { RenderType } from './game_engine_option.js';
import Scene from './scene/scene.js';


export default class GameEngine {
	constructor(el, gameOption = GameEngineOption) {
		if (gameOption.renderType === RenderType.canvas) {
			this.renderer = new CanvasRenderer(el, gameOption);
		} else {
			throw new Error(`GameEngine 未知类型的 renderType ${gameOption.renderType}`);
		}

		this.scene = new Scene();

		this.nextRenderHandle = -1;

		this.evnets = new CanvasEvents(el);

		const renderFun = () => {
			this.requestRender();
		};
		this.evnets.addEvents('CanvasMove', new CanvasOperateObject(this.scene, this.renderer.camera, renderFun));
		this.evnets.addEvents('CanvasOperateObject', new CanvasMove2d(this.scene, this.renderer.camera, renderFun));

		this.afterRender = gameOption.afterRender;
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