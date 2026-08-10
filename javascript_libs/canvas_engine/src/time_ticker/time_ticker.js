import { BaseCleanUp } from "../../../javascript_utils/javascript_utils.js";
import { now } from "../../../javascript_utils/javascript_utils.js";
import { LoaderManager } from "../loader/loader_manager.js";

export class TimeTicker extends BaseCleanUp {
	/** @private @type {boolean} */
	_started;
	/** @private @type {number | null} */
	_requestId;
	/** @private @type {number} */
	_timestamp = 0;
	/** @private @type {number} */
	_pauseTimestamp = 0;
	/** @private @type {Array<CanvasEngineType.TimeTickerCallback>} */
	_runCallbacks;
	/** @private @type {Array<CanvasEngineType.TimeTickerCallback>} */
	_pauseCallbacks;
	/**
	 * @param {CanvasEngineType.TimeTickerOption} timeTickerOption
	 */
	constructor(timeTickerOption) {
		super();

		this._started = false;
		this._requestId = null;
		this._runCallbacks = [];
		this._pauseCallbacks = [];

		this.start = this.start.bind(this);
		this.run = this.run.bind(this);

		if (timeTickerOption.autoStart) {
			if (timeTickerOption.waitLoadingCompleteStart) {
				LoaderManager.addLoadingCompleteCallback(this.start);
			} else {
				this.start();
			}
		}
	}
	start() {
		if (!this._started) {
			this._started = true;
			this.run();
		}
	}
	run() {
		if (this._started) {
			this._timestamp = now();
			this._requestId = requestAnimationFrame(this.run);

			try {
				for (let i = 0, len = this._runCallbacks.length; i < len; i++) {
					this._runCallbacks[i](this._timestamp);
				}
			} catch (error) {
				console.error("TimeTicker run callback error:", error);
				this.pause();
			}
		}
	}
	pause() {
		if (this._started) {
			this._started = false;
			this._pauseTimestamp = now();

			if (this._requestId) {
				cancelAnimationFrame(this._requestId);
				this._requestId = null;
			}

			for (let i = 0, len = this._pauseCallbacks.length; i < len; i++) {
				this._pauseCallbacks[i](this._pauseTimestamp);
			}
		}
	}
	/**
	 * @param {CanvasEngineType.TimeTickerCallback} runCallback
	 */
	addRunCallback(runCallback) {
		if (!this._runCallbacks.includes(runCallback)) {
			this._runCallbacks.push(runCallback);
		}
	}
	/**
	 * @param {CanvasEngineType.TimeTickerCallback} runCallback
	 */
	removeRunCallback(runCallback) {
		const index = this._runCallbacks.indexOf(runCallback);
		if (index > -1) {
			this._runCallbacks.splice(index, 1);
		}
	}
	/**
	 * @param {CanvasEngineType.TimeTickerCallback} pauseCallbacks
	 */
	addPauseCallback(pauseCallbacks) {
		if (!this._pauseCallbacks.includes(pauseCallbacks)) {
			this._pauseCallbacks.push(pauseCallbacks);
		}
	}
	/**
	 * @param {CanvasEngineType.TimeTickerCallback} pauseCallbacks
	 */
	removePauseCallback(pauseCallbacks) {
		const index = this._pauseCallbacks.indexOf(pauseCallbacks);
		if (index > -1) {
			this._pauseCallbacks.splice(index, 1);
		}
	}
	destroy() {
		if (this._requestId) {
			cancelAnimationFrame(this._requestId);
		}

		super.destroy();
	}
}
