import loaderManager from '../loader_manager.js';

const TaskState = {
	wait: 'wait',
	loading: 'loading',
	loaded: 'loaded',
	error: 'error',
}


export default class Task {
	constructor(onloaded = null, onerror = null, index, key) {
		this.index = index;
		this.key = key;

		this.state = TaskState.wait;

		this.onloaded = onloaded;
		this.onerror = onerror;
		this.errorTime = 0;

		this.loaded = this.loaded.bind(this);
		this.error = this.error.bind(this);
	}

	loading() {
		this.state = TaskState.loading;
	}
	loaded() {
		this.state = TaskState.loaded;
		loaderManager.onLoaded(this);
		if (this.onloaded !== null) {
			this.onloaded(this);
		}
	}
	error() {
		this.state = TaskState.error;
		this.errorTime++;
		loaderManager.onError(this);
		if (this.onerror !== null) {
			this.onerror(this);
		}
	}

	isLoaded() {
		return this.state === TaskState.loaded;
	}
	isError() {
		return this.state === TaskState.error;
	}

	destroy() {
		this.index =
			this.key =

			this.state =

			this.onloaded =
			this.onerror =
			this.errorTime =

			this.loaded =
			this.error = null;
	}
}