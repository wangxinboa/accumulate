import Animation from './animation.js';


export default class AnimationTween extends Animation {
	constructor(object, frames) {
		super(object, frames);
	}

	update(time) {
		if (this.paused) {
			return;
		}

		const
			{
				target: endTarget,
				duration, delayTime = 0,
				yoyo = false, repeat = 0
			} = this.endFrame;

		let progress = (time < this.startTime + delayTime) ? 0 : (time - this.startTime - delayTime) / duration;
		progress = progress > 1 ? 1 : progress;

		const value = (yoyo && this.completeCount < repeat && this.completeCount % 2 === 1) ?
			1 - progress : progress;

		let startVal, endVal;

		if (progress === 0) {
		} else if (progress <= 1) {
			for (let key in endTarget) {
				startVal = this.startTarget[key];
				endVal = endTarget[key];

				this.object[key] = (endVal - startVal) * value + startVal;
			}
		}

		if (progress === 1) {
			if (++this.completeCount < repeat) {
				this.startTime = time;
			} else {
				if (this.toNextFrame()) {
					this.completeCount = 0;
					this.startTime = time;
				} else {
					this.object.stopAnimation();
				}
			}
		}

		startVal = endVal = null;
	}

	destroy() {
		super.destroy();
	}
}