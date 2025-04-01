

export default class Animation {
	constructor(object, frames = []) {
		this.object = object;
		this.frames = frames;

		this._initTarget = {};
		this.setInitTarget();

		this.startTarget = null;
		this._endFrameIndex = -1;
		this.endFrame = null;

		this.completeCount = 0;

		this._startTime = -1;
		this.paused = true;
		this.pausedTime = -1;

		// this._loop = true;
		// this._loopCount = 0;
	}

	setInitTarget() {
		for (let key in this.frames[0].target) {
			this._initTarget[key] = this.object[key];
		}
	}

	setStartTime(time) {
		this._startTime = time;
	}

	loop(loop) {
		this._loop = loop;
	}

	mountObject(object) {
		this.object = object;
		return this;
	}

	unmountObject() {
		this.object = null;
		return this;
	}

	addFrames(frames) {
		if (Array.isArray(frames)) {
			for (let i = 0, len = frames.length; i < len; i++) {
				this.frames.push(frames[i]);
			}
		} else {
			this.frames.push(frames);
		}
		return this;
	}

	toNextFrame() {
		if (this.frames.length === this._endFrameIndex + 1) {
			// if (this._loop) {
			// 	this.start(0);
			// 	return true;
			// } else {
			return false;
			// }
		} else {
			this.start(this._endFrameIndex + 1);
			return true;
		}
	}

	start(frameIndex = 0) {
		if (this.frames.length <= frameIndex) {
			throw new Error('frames 内元素数量小于 frameIndex, 无法开始动画');
		}

		if (frameIndex === 0) {
			this.startTarget = this._initTarget;
		} else {
			this.startTarget = this.frames[frameIndex - 1].target;
		}
		this._endFrameIndex = frameIndex;
		this.endFrame = this.frames[frameIndex];

		this.completeCount = 0;

		this.paused = false;
		this.pausedTime = -1;
	}

	reset() {
		this.startTarget = null;
		this._endFrameIndex = -1;
		this.endFrame = null;

		this.completeCount = 0;

		this._startTime = -1;
		this.paused = true;
		this.pausedTime = -1;
	}

	pause() {
		this.paused = true;
	}

	resume() {
		this.paused = false;
		this.pausedTime = -1;
	}

	destroy() {
		this.object =
			this.frames =

			this._initTarget =
			this.startTarget =
			this._endFrameIndex =
			this.endFrame =

			this.completeCount =

			this._startTime =
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

		delete this._startTime;
		delete this.paused;
		delete this.pausedTime;

		delete this._loop;
	}
}