import { BaseCleanUp } from "../../../../javascript_utils/javascript_utils.js";

export class BaseTask extends BaseCleanUp {
	/** @type {string} 任务作为独一无二的标识 key */
	key;
	/** @type {Array<CanvasEngineType.TaskCallback>} */
	loadedCallbacks;
	/** @type {Array<CanvasEngineType.TaskCallback>} */
	errorCallbacks;
	/** @type {Array<CanvasEngineType.TaskCallback>} */
	finalErrorCallbacks;
	/** @type {boolean} */
	isLoaded;
	/** @type {boolean} */
	isError;

	/**
	 * @param {string} url 任务对应的 url 链接
	 */
	constructor(url) {
		super();
		this.key = url;

		this.errorTime = 0;
		this.maxErrorTime = 3;

		this.loadedCallbacks = [];
		this.errorCallbacks = [];
		this.finalErrorCallbacks = [];

		this.isLoaded = false;
		this.isError = false;
	}
	startLoad() {
		return this;
	}
	loadingComplete() {
		return this;
	}
	/**
	 * @param {CanvasEngineType.TaskCallback} loadedCallback
	 */
	addLoadedCallback(loadedCallback) {
		this.loadedCallbacks.push(loadedCallback);
		return this;
	}
	onload() {
		this.isLoaded = true;

		this.loadingComplete();
		for (let i = this.loadedCallbacks.length - 1; i >= 0; i--) {
			this.loadedCallbacks[i]?.(this);
		}
		this.loadedCallbacks.length = 0;
	}
	/**
	 * @param {CanvasEngineType.TaskCallback} errorCallback
	 */
	addErrorCallback(errorCallback) {
		this.errorCallbacks.push(errorCallback);
		return this;
	}
	onerror() {
		if (this.errorTime >= this.maxErrorTime) {
			this.onFinalError();
			this.errorCallbacks.length = 0;
		} else {
			this.errorTime++;
			for (let i = this.errorCallbacks.length - 1; i >= 0; i--) {
				this.errorCallbacks[i]?.(this);
			}
			this.startLoad();
		}
	}
	/**
	 * @param {CanvasEngineType.TaskCallback} finalErrorCallback
	 */
	addFinalErrorCallbacks(finalErrorCallback) {
		this.finalErrorCallbacks.push(finalErrorCallback);
		return this;
	}
	onFinalError() {
		this.isError = true;

		for (let i = this.finalErrorCallbacks.length - 1; i >= 0; i--) {
			this.finalErrorCallbacks[i]?.(this);
		}
		this.finalErrorCallbacks.length = 0;
	}
}
