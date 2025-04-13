import loaderManager from './loader_manager.js';

// const TaskState = {
// 	wait: 'wait',
// 	loading: 'loading',
// 	loaded: 'loaded',
// 	error: 'error',
// }


export default class LoaderTask {
	constructor(onloaded = null, onerror = null, index, key) {
		this.index = index;
		this.key = key;

		// this.state = TaskState.wait;
		this.isWait = true;
		this.isLoading = true;
		this.isLoaded = false;
		this.isError = false;

		this.onloaded = onloaded;
		this.onerror = onerror;
		this.errorTime = 0;

		this.loaded = this.loaded.bind(this);
		this.error = this.error.bind(this);
	}

	loading() {
		// this.state = TaskState.loading;
		this.isWait = false;
		this.isLoading = true;
	}
	loaded() {
		// this.state = TaskState.loaded;
		this.isLoading = false;
		this.isLoaded = true;

		loaderManager.onLoaded(this);
		if (this.onloaded !== null) {
			this.onloaded(this);
		}
	}
	error() {
		// this.state = TaskState.error;
		this.isLoading = false;
		this.isError = true;

		this.errorTime++;
		loaderManager.onError(this);
		if (this.onerror !== null) {
			this.onerror(this);
		}
	}

	destroy() {
		this.index =
			this.key =

			// this.state =
			this.isWait =
			this.isLoading =
			this.isLoaded =
			this.isError =

			this.onloaded =
			this.onerror =
			this.errorTime =

			this.loaded =
			this.error = null;

		delete this.index;
		delete this.key;

		// delete this.state;
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