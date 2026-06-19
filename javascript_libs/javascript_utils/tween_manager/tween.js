import { getValueByPath, setValueByPath } from "../data_type/object.js";
import { BaseCleanUp } from "../javascript_utils.js";

export class Tween extends BaseCleanUp {
	/** @type {number} */
	duration;
	/** @type {number} */
	delayTime;
	/** @type {JavaScriptUtilsType.TweenConfig["targets"]} */
	targets;
	/** @type {boolean} */
	yoyo;
	/** @type {number} */
	loopCount;
	/** @type {JavaScriptUtilsType.TweenCallbacks} */
	startCallback;
	/** @type {JavaScriptUtilsType.TweenCallbacks} */
	updateCallback;
	/** @type {JavaScriptUtilsType.TweenCallbacks} */
	pauseCallback;
	/** @type {JavaScriptUtilsType.TweenCallbacks} */
	endCallback;
	/**
	 * @param {JavaScriptUtilsType.TweenConfig} tweenConfig
	 */
	constructor(tweenConfig) {
		super();

		this.duration = tweenConfig.duration;
		this.delayTime = tweenConfig.delayTime ?? 0;
		this.targets = tweenConfig.targets;
		this.yoyo = tweenConfig.yoyo ?? false;
		this.loopCount = tweenConfig.loopCount ?? 0;

		this.startCallback = [];
		this.updateCallback = [];
		this.pauseCallback = [];
		this.endCallback = [];
	}
	/**
	 * @param {JavaScriptUtilsType.TweenConfigTarget} target
	 */
	addTarget(target) {
		this.targets.push(target);
	}
	/**
	 * @param {Object} targetObj
	 */
	onStart(targetObj) {
		for (let i = 0, len = this.targets.length; i < len; i++) {
			const target = this.targets[i];
			target.start = getValueByPath(targetObj, target.path);
		}

		for (let i = 0, len = this.startCallback.length; i < len; i++) {
			this.startCallback[i]();
		}
	}
	/**
	 * @param {Object} targetObj
	 * @param {number} portion
	 */
	onUpdate(targetObj, portion) {
		for (let i = 0, len = this.targets.length; i < len; i++) {
			const target = this.targets[i];
			setValueByPath(
				targetObj,
				target.path,
				/** @type {number} */ (target.start) + portion * (target.target - /** @type {number} */ (target.start)),
			);
		}

		for (let i = 0, len = this.updateCallback.length; i < len; i++) {
			this.updateCallback[i]();
		}
	}
	onPause() {
		for (let i = 0, len = this.pauseCallback.length; i < len; i++) {
			this.pauseCallback[i]();
		}
	}
	onEnd() {
		for (let i = 0, len = this.endCallback.length; i < len; i++) {
			this.endCallback[i]();
		}
	}
	/**
	 * @param {JavaScriptUtilsType.TweenCallback} callback
	 */
	addStartCallback(callback) {
		this.startCallback.push(callback);
	}
	/**
	 * @param {JavaScriptUtilsType.TweenCallback} callback
	 */
	addUpdateCallback(callback) {
		this.updateCallback.push(callback);
	}
	/**
	 * @param {JavaScriptUtilsType.TweenCallback} callback
	 */
	addPauseCallback(callback) {
		this.pauseCallback.push(callback);
	}
	/**
	 * @param {JavaScriptUtilsType.TweenCallback} callback
	 */
	addEndCallback(callback) {
		this.endCallback.push(callback);
	}

	destroy() {
		super.destroy();
	}
}
