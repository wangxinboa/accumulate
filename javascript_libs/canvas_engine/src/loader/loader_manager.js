import { ImageTask } from "./task/image_task.js";

/** @type {Array<CanvasEngineType.AllTaskType>} 所有加载任务的数组列表 */
const taskList = [];
/** 下一个准备加载的任务在 taskList 里的下标 */
let nextLoadIndex = 0;
/** 当前正在在加载中的任务数量 */
let nowLoadingCount = 0;
/** @type {Record<string, CanvasEngineType.AllTaskType>} 所有加载任务的缓存对象, 以任务 url 为 key */
const cacheLoadedAssets = {};
/** @type {Array<Function>} 当所有任务加载完毕之后执行的函数数组 */
const loadingCompleteCallbacks = [];

/**
 * 添加任务到任务数组中
 * @template {CanvasEngineType.BaseTask} T
 * @param {T} task
 * @returns {T}
 */
function addTask(task) {
	cacheLoadedAssets[task.key] = task;
	task.addLoadedCallback(afterTaskLoadingComplete).addFinalErrorCallbacks(afterTaskFinalError);
	taskList.push(task);

	nextTaskStartLoad();
	return task;
}
/** 任务完成加载之后执行 */
function afterTaskLoadingComplete() {
	nowLoadingCount--;
	nextTaskStartLoad();
	afterLoadingComplete();
}
/** 任务最终加载失败之后执行 */
function afterTaskFinalError() {
	nowLoadingCount--;
	nextTaskStartLoad();
	afterLoadingComplete();
}
/** 下一个任务开始加载请求 */
function nextTaskStartLoad() {
	if (nowLoadingCount < LoaderManager.maxLoadingCount && nextLoadIndex < taskList.length) {
		taskList[nextLoadIndex].startLoad();
		nowLoadingCount++;
		nextLoadIndex++;
	}
}
/** 当所有任务加载完毕之后执行 */
function afterLoadingComplete() {
	if (LoaderManager.isLoadingComplete) {
		for (let i = loadingCompleteCallbacks.length - 1; i >= 0; i--) {
			loadingCompleteCallbacks[i]?.();
		}
		loadingCompleteCallbacks.length = 0;
	}
}

export const LoaderManager = {
	maxLoadingCount: 5,
	/**
	 * 添加一个 image 加载任务
	 * @param {string} url 图片链接
	 */
	addImageTask(url) {
		if (cacheLoadedAssets[url] instanceof ImageTask) {
			return cacheLoadedAssets[url];
		} else {
			const imageTask = new ImageTask(url);
			return addTask(imageTask);
		}
	},
	/**
	 * 添加多个 image 加载任务
	 * @param {string[]} urls 图片链接数组
	 */
	addImageTasks(urls) {
		/** @type {Array<CanvasEngineType.ImageTask>} */
		const tasks = [];
		for (let i = 0, len = urls.length; i < len; i++) {
			tasks.push(this.addImageTask(urls[i]));
		}
		return tasks;
	},
	get isLoadingComplete() {
		return taskList.length === nextLoadIndex && nowLoadingCount === 0;
	},
	/**
	 * @param {Function} loadingCompleteCallback 添加当所有任务加载完毕之后的回调执行函数
	 */
	addLoadingCompleteCallback(loadingCompleteCallback) {
		loadingCompleteCallbacks.push(loadingCompleteCallback);
	},
};
