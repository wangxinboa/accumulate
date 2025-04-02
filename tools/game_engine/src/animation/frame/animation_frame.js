
export default class AnimationFrame {
	constructor(frame = {}) {
		this.target = frame.target || {};
		this.duration = frame.duration || 0;
		this.delayTime = frame.delayTime || 0;
		this.yoyo = frame.yoyo || false;
		this.repeat = frame.repeat || 0;
	}

	destroy() {
		this.target = null;
		this.duration = null;
		this.delayTime = null;
		this.yoyo = null;
		this.repeat = null;

		delete this.target;
		delete this.duration;
		delete this.delayTime;
		delete this.yoyo;
		delete this.repeat;
	}
}