import EventEmitter from '../event/event_emitter.js';
import AnimationTween from './frames_manager/animation_tween.js'
import AnimationIndex from './frames_manager/animation_index.js';

export default class AnimationManager extends EventEmitter {
	constructor() {
		super();

		this._animations = {};
		this._nowAnimation = null;
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

	startAnimation(name, needReset = true) {
		if (this._nowAnimation && needReset) {
			this._nowAnimation.reset();
		}
		this._nowAnimation = this._animations[name];
		this._nowAnimation.start();
	}

	update(time) {
		if (this._nowAnimation !== null) {
			this._nowAnimation.update(time);
		}
	}

	stopAnimation() {
		if (this._nowAnimation !== null) {
			this._nowAnimation.reset();
			this._nowAnimation = null;
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

	destroy() {
		super.destroy();

		for (let key in this._animations) {
			this._animations[key].destroy();
			delete this._animations[key];
		}

		this._animations =
			this._nowAnimation = null;

		delete this._animations;
		delete this._nowAnimation;
	}
}
