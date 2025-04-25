import AnimationManager from '../../animation/animation_manager.js';


export default class PlaneDef extends AnimationManager {
	constructor(option = {}) {
		super();

		this.anchorX = option.anchorX || 0;
		this.anchorY = option.anchorY || 0;
	}

	destroy() {
		super.destroy();

		this.anchorX =
			this.anchorY = null;

		delete this.anchorX;
		delete this.anchorY;
	};
}