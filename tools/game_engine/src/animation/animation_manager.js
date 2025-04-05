import EventEmitter from '../event/event_emitter.js';
import AnimationTween from './frames_manager/animation_tween.js'
import AnimationIndex from './frames_manager/animation_index.js';

export default class AnimationManager extends EventEmitter {
	constructor() {
		super();

		this._animations = {};
		this._nowAnimation = null;

		this.isPlaying = false;
	}

	addAnimationTween(name, frames) {
		if (this._animations[name]) {
			this._animations[name].destroy();
		}

		const animationTween = new AnimationTween(this, frames);
		this._animations[name] = animationTween
		return animationTween;
	}

	addAnimationIndex(name, frames) {
		if (this._animations[name]) {
			this._animations[name].destroy();
		}
		const animationIndex = new AnimationIndex(this, frames);
		this._animations[name] = animationIndex;
		return animationIndex;
	}

	startAnimation(name) {
		this._nowAnimation = this._animations[name];
		if (this._nowAnimation) {
			this._nowAnimation.start();

			this.isPlaying = true;
		}
	}

	update(time) {
		if (this._nowAnimation !== null) {
			this._nowAnimation.update(time);

			if (this._nowAnimation.finished) {
				this.stopAnimation();
			}
		}
	}

	stopAnimation() {
		if (this._nowAnimation !== null) {
			this._nowAnimation = null;

			this.isPlaying = false;
		}
	}

	pauseAnimation() {
		if (this._nowAnimation !== null) {
			this._nowAnimation.pause();
		}
	}

	resumeAnimation() {
		if (this._nowAnimation !== null) {
			this._nowAnimation.resume();
		}
	}

	pauseResumeAnimation() {
		if (this._nowAnimation !== null) {
			if (this._nowAnimation.paused) {
				this._nowAnimation.resume();
			} else {
				this._nowAnimation.pause();
			}
		}
	}

	destroy() {
		super.destroy();

		for (let key in this._animations) {
			this._animations[key].destroy();
			delete this._animations[key];
		}

		this._animations =
			this._nowAnimation =
			this.isPlaying = null;

		delete this._animations;
		delete this._nowAnimation;
		delete this.isPlaying;
	}
}
