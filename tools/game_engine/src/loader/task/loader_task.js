import loaderManager from '../loader_manager.js';
// const TaskState = {
// 	wait: 'wait',
// 	loading: 'loading',
// 	loaded: 'loaded',
// 	error: 'error',
// }


export default class LoaderTask {
	constructor(onloaded, onerror, key) {
		this.taskIndex = loaderManager.totalTaskCount;
		this.key = key;

		this.isWait = true;
		this.isLoading = false;
		this.isLoaded = false;
		this.isError = false;

		this.onloaded = onloaded;
		this.onerror = onerror;
		this.errorTime = 0;

		this.loaded = this.loaded.bind(this);
		this.error = this.error.bind(this);
	}

	load() {
		this.isWait = false;
		this.isLoading = true;
		this.isLoaded = false;
		this.isError = false;
	}
	loaded() {
		this.isWait = false;
		this.isLoading = false;
		this.isLoaded = true;
		this.isError = false;

		loaderManager._onTaskLoaded(this);
		if (this.onloaded) {
			this.onloaded(this);
		}
	}
	error() {
		this.isWait = false;
		this.isLoading = false;
		this.isLoaded = false;
		this.isError = true;

		this.errorTime++;
		loaderManager._onTaskError(this);
		if (this.onerror) {
			this.onerror(this);
		}
	}

	destroy() {
		this.taskIndex =
			this.key =

			this.isWait =
			this.isLoading =
			this.isLoaded =
			this.isError =

			this.onloaded =
			this.onerror =
			this.errorTime =

			this.loaded =
			this.error = null;

		delete this.taskIndex;
		delete this.key;

		delete this.isWait;
		delete this.isLoading;
		delete this.isLoaded;
		delete this.isError;

		delete this.onloaded;
		delete this.onerror;
		delete this.errorTime;

		delete this.loaded;
		delete this.error;
	}
}