import { BaseCleanUp } from "../base_class/base_clean_up.js";
import { CustomMap } from "../custom_map.js";
import { now } from "../javascript_utils.js";
import { Tween } from "./tween.js";

export class TweenManager extends BaseCleanUp {
	/** @type {number} */
	startTime;
	/** @type {number} */
	pausedTime;
	/** @type {boolean} */
	isPlaying;
	/** @type {boolean} */
	isPaused;
	/** @type {CustomMap<Tween>} */
	tweenMap;
	/** @type {number} */
	currentLoopCount;
	/** @type {Tween | null} */
	acticeTween = null;
	constructor() {
		super();

		this.startTime = 0;
		this.pausedTime = 0;
		this.isPlaying = false;
		this.isPaused = false;
		this.tweenMap = new CustomMap();
		this.currentLoopCount = 0;
		this.acticeTween = null;
	}
	/**
	 * @param {string} tweenName
	 * @param {JavaScriptUtilsType.TweenConfig} tweenConfig
	 */
	setTween(tweenName, tweenConfig) {
		this.tweenMap.set(tweenName, new Tween(tweenConfig));
		return this;
	}
	/**
	 * @param {string} tweenName
	 * @param {Object} targetObj
	 */
	start(tweenName, targetObj) {
		if (this.tweenMap.has(tweenName)) {
			if (this.isPaused && this.acticeTween === this.tweenMap.get(tweenName)) {
				this.startTime = this.startTime + (now() - this.pausedTime);
			} else {
				this.startTime = now();
				this.acticeTween = this.tweenMap.get(tweenName);
				this.acticeTween.onStart(targetObj);
			}

			this.isPlaying = true;
			this.isPaused = false;
		}
		return this;
	}
	pause() {
		if (this.isPlaying) {
			this.pausedTime = now();
			this.isPlaying = false;
			this.isPaused = true;
		}
	}
	/**
	 * @param {number} time
	 * @param {Object} targetObj
	 */
	update(time, targetObj) {
		if (this.acticeTween !== null && this.isPlaying && !this.isPaused) {
			const portion = Math.min(
				time < this.startTime + this.acticeTween.delayTime
					? 0
					: (time - this.startTime - this.acticeTween.delayTime) / this.acticeTween.duration - this.currentLoopCount,
				1,
			);

			if (this.currentLoopCount % 2 === 1 && this.acticeTween.yoyo) {
				this.acticeTween.onUpdate(targetObj, 1 - portion);
			} else {
				this.acticeTween.onUpdate(targetObj, portion);
			}

			if (portion === 1) {
				if (this.currentLoopCount < this.acticeTween.loopCount - 1) {
					this.currentLoopCount++;
				} else {
					this.end();
				}
			}
		}
		return this;
	}
	end() {
		this.acticeTween = null;
		this.startTime = 0;
		this.isPlaying = false;
		this.currentLoopCount = 0;

		return this;
	}
}
