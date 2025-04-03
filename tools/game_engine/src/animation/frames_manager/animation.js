import AnimationFrame from '../frame/animation_frame.js';


function now() {
	return performance.now();
}

export default class Animation {
	constructor(object, frames = []) {
		this.object = object;
		this.frames = [];
		this.addFrames(frames);

		this._initTarget = {};

		this.startTarget = null;
		this._endFrameIndex = -1;
		this.endFrame = null;

		this.completeCount = 0;

		this.startTime = -1;
		this.paused = true;
		this.pausedTime = -1;

		// this._loop = true;
		// this._loopCount = 0;
	}

	loop(loop) {
		this._loop = loop;
	}

	addFrames(frames) {
		if (Array.isArray(frames)) {
			for (let i = 0, len = frames.length; i < len; i++) {
				this.frames.push(new AnimationFrame(frames[i]));
			}
		} else {
			this.frames.push(new AnimationFrame(frames));
		}
		return this;
	}

	toNextFrame() {
		if (this.frames.length === this._endFrameIndex + 1) {
			// console.info('')
			// if (this._loop) {
			// 	this.start(0);
			// 	return true;
			// } else {
			return false;
			// }
		} else {
			this.startTarget = this.frames[this._endFrameIndex].target;
			this._endFrameIndex++;
			this.endFrame = this.frames[this._endFrameIndex];
			return true;
		}
	}

	start() {
		if (this.frames.length <= 1) {
			throw new Error('frames 内元素数量小于 frameIndex, 无法开始动画');
		}

		for (let key in this.frames[0].target) {
			this._initTarget[key] = this.object[key];
		}
		this.startTarget = this._initTarget;
		this._endFrameIndex = 0;
		this.endFrame = this.frames[0];

		this.completeCount = 0;

		this.startTime = now();
		this.paused = false;
	}

	update(time) {
		if (this.paused) {
			return;
		}

		const { target: endTarget, duration, delayTime, yoyo, repeat } = this.endFrame;

		let progress = (time < this.startTime + delayTime) ? 0 : (time - this.startTime - delayTime) / duration;
		progress = progress > 1 ? 1 : progress;

		const value = (yoyo && this.completeCount < repeat && this.completeCount % 2 === 1) ?
			1 - progress : progress;

		if (progress === 0) {
		} else if (progress <= 1) {
			this._updateProperties(this.object, this.startTarget, endTarget, value);
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
	}

	stop() {

	}

	pause() {
		this.paused = true;
		this.pausedTime = now();
	}

	resume() {
		this.paused = false;
		this.startTime += (now() - this.pausedTime);
	}

	finish() {
		this._finished = true;
	}

	destroy() {
		for (let i = this.frames.length; i >= 0; i--) {
			this.frames[i].destroy();
			this.frames.pop();
		}

		this.object =
			this.frames =

			this._initTarget =
			this.startTarget =
			this._endFrameIndex =
			this.endFrame =

			this.completeCount =

			this.startTime =
			this.paused =
			this.pausedTime =

			this._loop = null;

		delete this.object;
		delete this.frames;

		delete this._initTarget;
		delete this.startTarget;
		delete this._endFrameIndex;
		delete this.endFrame;

		delete this.completeCount;

		delete this.startTime;
		delete this.paused;
		delete this.pausedTime;

		delete this._loop;
	}
}