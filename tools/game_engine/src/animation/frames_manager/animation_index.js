import Animation from './animation.js';


export default class AnimationIndex extends Animation {
	constructor(target) {
		super(target);
	}

	update(time) {
		if (this.paused) {
			return;
		}

		this.nowTime = time;
	}

	destroy() {
		super.destroy();
	}
}