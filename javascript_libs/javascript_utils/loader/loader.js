import { ImageTask } from "./task/image_task.js";

export class Loader {
	/** @type {Array<JavaScriptUtilsType.AllTaskType>} 所有加载任务的数组列表 */
	_taskList = [];
	/** 下一个准备加载的任务在 _taskList 里的下标 */
	_nextLoadTaskIndex = 0;
	/** 当前正在在加载中的任务数量 */
	_nowLoadingTaskCount = 0;
	/** @type {Record<string, JavaScriptUtilsType.AllTaskType>} 所有加载任务的缓存对象, 以任务 url 为 key */
	_cacheLoadedTasks = {};
	/** @type {Array<Function>} 当所有任务加载完毕之后执行的函数数组 */
	_loadingCompleteCallbacks = [];
	/** 最大同时加载数量 */
	maxLoadingCount = 5;

	constructor() {
		this._afterTaskLoadingComplete = this._afterTaskLoadingComplete.bind(this);
		this._afterTaskFinalError = this._afterTaskFinalError.bind(this);
	}

	/**
	 * 添加任务到任务数组中
	 * @private
	 * @template {JavaScriptUtilsType.BaseTask} T
	 * @param {T} task
	 * @returns {T}
	 */
	_addTask(task) {
		this._cacheLoadedTasks[task.key] = task;
		task.addLoadedCallback(this._afterTaskLoadingComplete).addFinalErrorCallbacks(this._afterTaskFinalError);
		this._taskList.push(task);

		this._nextTaskStartLoad();
		return task;
	}

	/**
	 * 任务完成加载之后执行
	 * @private
	 */
	_afterTaskLoadingComplete() {
		this._nowLoadingTaskCount--;
		this._nextTaskStartLoad();
		this._afterLoadingComplete();
	}
	/**
	 * 任务最终加载失败之后执行
	 * @private
	 */
	_afterTaskFinalError() {
		this._nowLoadingTaskCount--;
		this._nextTaskStartLoad();
		this._afterLoadingComplete();
	}

	/**
	 * 下一个任务开始加载请求
	 * @private
	 */
	_nextTaskStartLoad() {
		if (this._nowLoadingTaskCount < this.maxLoadingCount && this._nextLoadTaskIndex < this._taskList.length) {
			this._taskList[this._nextLoadTaskIndex].startLoad();
			this._nowLoadingTaskCount++;
			this._nextLoadTaskIndex++;
		}
	}
	/**
	 * 当所有任务加载完毕之后执行
	 * @private
	 */
	_afterLoadingComplete() {
		if (this.isLoadingComplete) {
			for (let i = this._loadingCompleteCallbacks.length - 1; i >= 0; i--) {
				this._loadingCompleteCallbacks[i]?.();
			}
			this._loadingCompleteCallbacks.length = 0;
		}
	}

	/**
	 * 添加一个 image 加载任务
	 * @param {string} url 图片链接
	 * @returns {ImageTask}
	 */
	addImageTask(url) {
		if (this._cacheLoadedTasks[url] instanceof ImageTask) {
			return this._cacheLoadedTasks[url];
		} else {
			const imageTask = new ImageTask(url);
			return this._addTask(imageTask);
		}
	}
	/**
	 * 添加多个 image 加载任务
	 * @param {string[]} urls 图片链接数组
	 * @returns {ImageTask[]}
	 */
	addImageTasks(urls) {
		/** @type {Array<JavaScriptUtilsType.ImageTask>} */
		const tasks = [];
		for (let i = 0, len = urls.length; i < len; i++) {
			tasks.push(this.addImageTask(urls[i]));
		}
		return tasks;
	}

	get isLoadingComplete() {
		return this._taskList.length === this._nextLoadTaskIndex && this._nowLoadingTaskCount === 0;
	}
	/**
	 * @param {Function} loadingCompleteCallback 添加当所有任务加载完毕之后的回调执行函数
	 */
	addLoadingCompleteCallback(loadingCompleteCallback) {
		this._loadingCompleteCallbacks.push(loadingCompleteCallback);
	}
}
