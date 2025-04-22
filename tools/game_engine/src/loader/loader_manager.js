import ImageTask from './task/image_task.js';
import LoaderTask from './task/loader_task.js';


let _imageTask_ = null;

class LoaderManager {
	constructor() {
		this._onTaskLoaded = this._onTaskLoaded.bind(this);
		this._onTaskError = this._onTaskError.bind(this);

		this.queue = [];

		this.nextLoadingIndex = 0;
		this.nowLoadingCount = 0;
		this.maxLoadingCount = 5;

		this.totalTaskCount = 0;
		this.totalLoaded = 0;
		this.totalError = 0;

		this.failedReloadTime = 3;

		this.multiCacke = {};
		this.imageCache = {};
		this.spriteSheetCache = {};
	}

	_onTaskLoaded(task) {
		this.totalLoaded++;
		this.nowLoadingCount--;

		this._loadingNextTask();
	}
	/**
	 * task 任务加载失败时
	 * @param {LoaderTask} task
	 */
	_onTaskError(task) {
		if (task.errorTime < this.failedReloadTime) {
			task.load();
		} else {
			task.confirmError();

			this.totalError++;
			this.nowLoadingCount--;
			this._loadingNextTask();
		}
	}
	/**
	 * 添加新的任务进入队列
	 * @param {LoaderTask} task
	 * @returns {LoaderTask} task.
	 */
	_addTask(task) {
		this.queue.push(task);
		this.totalTaskCount++;

		this._loadingNextTask();

		return task;
	}
	_loadingNextTask() {
		if (
			this.nowLoadingCount < this.maxLoadingCount &&
			this.nextLoadingIndex < this.queue.length
		) {
			this.queue[this.nextLoadingIndex++].load();
			this.nowLoadingCount++;
		}
	}

	_cacheTaskCallback(task, onLoaded, onError) {
		if (task.isLoaded && onLoaded) {
			onLoaded(task);
		} else if (task.isError && onError) {
			onError(task);
		} else if (task.isWait || task.isLoading) {
			task.wait(onLoaded, onError);
		}
	}

	addImageByUrl(url, crossOrigin, onLoaded, onError) {
		if (this.imageCache.hasOwnProperty(url)) {
			_imageTask_ = this.imageCache[url];
			this._cacheTaskCallback(_imageTask_, onLoaded, onError);
		} else {
			_imageTask_ = new ImageTask(onLoaded, onError, url, crossOrigin);
			this.imageCache[url] = _imageTask_;
			this._addTask(_imageTask_);
		}
		return _imageTask_;
	}

	destroy() {
		this._onTaskLoaded =
			this._onTaskError =

			this.queue =

			this.nextLoadingIndex =
			this.nowLoadingCount =
			this.maxLoadingCount =

			this.totalTaskCount =
			this.totalLoaded =
			this.totalError =

			this.failedReloadTime =

			this.multiCacke =
			this.imageCache =
			this.SpriteSheetCache = null;

		delete this._onTaskLoaded;
		delete this._onTaskError;

		delete this.queue;

		delete this.nextLoadingIndex;
		delete this.nowLoadingCount;
		delete this.maxLoadingCount;

		delete this.totalTaskCount;
		delete this.totalLoaded;
		delete this.totalError;

		delete this.failedReloadTime;

		delete this.multiCacke;
		delete this.imageCache;
		delete this.SpriteSheetCache;
	}
}

const loaderManager = new LoaderManager();
export default loaderManager;