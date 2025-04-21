import loaderManager from './loader_manager.js';

export default class TaskManager {
	constructor(onfinish = null, onloaded = null, onerror = null) {
		this.tasks = [];
		this.totalTaskCount = 0;
		this.totalLoadedCount = 0;
		this.totalErrorCount = 0;

		this.taskLoaded = this.taskLoaded.bind(this);
		this.taskError = this.taskError.bind(this);

		this.onfinish = onfinish;
		this.onloaded = onloaded;
		this.onerror = onerror;

		this.isFinish = false;
	}
	addTask(task) {
		this.isFinish = false;
		this.totalTaskCount++;
		this.tasks.push(task);
	}
	taskLoaded(task) {
		this.totalLoadedCount++;
		if (this.onloaded) {
			this.onloaded(task);
		}
		this.testTaskFinish();
	}
	taskError(task) {
		this.totalErrorCount++;
		if (this.onerror) {
			this.onerror(task);
		}
		this.testTaskFinish();
	}
	testTaskFinish() {
		if (this.totalLoadedCount + this.totalErrorCount === this.totalTaskCount) {
			this.isFinish = true;
			if (this.onfinish) {
				this.onfinish(this);
			}
		}
	}

	// 与 loaderManager 保持一致
	addImageByUrl(url, crossOrigin) {
		this.addTask(
			loaderManager.addImageByUrl(url, crossOrigin, this.taskLoaded, this.taskError)
		);
		return this;
	}
	addImageByUrls(urls, crossOrigin) {
		for (let i = 0, len = urls.length; i < len; i++) {
			this.addTask(
				loaderManager.addImageByUrl(urls[i], crossOrigin, this.taskLoaded, this.taskError)
			);
		}
		return this;
	}

	destroy() {
		this.tasks =
			this.totalTaskCount =
			this.totalLoadedCount =
			this.totalErrorCount =

			this.taskLoaded =
			this.taskError =

			this.onfinish =
			this.onloaded =
			this.onerror =

			this.isFinish = null;

		delete this.tasks;
		delete this.totalTaskCount;
		delete this.totalLoadedCount;
		delete this.totalErrorCount;

		delete this.taskLoaded;
		delete this.taskError;

		delete this.onfinish;
		delete this.onloaded;
		delete this.onerror;

		delete this.isFinish;
	}
}