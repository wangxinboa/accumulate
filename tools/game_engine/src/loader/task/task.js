

const TaskState = {
	wait: 'wait',
	loading: 'loading',
	loaded: 'loaded',
	error: 'error',
}


export default class Task {
	constructor(loaderManager, onloaded = null, onerror = null, index, key) {
		this.loaderManager = loaderManager;
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
		this.loaderManager.onLoaded(this);
		if (this.onloaded !== null) {
			this.onloaded(this);
		}
	}
	error() {
		this.state = TaskState.error;
		this.errorTime++;
		this.loaderManager.onError(this);
		if (this.onerror !== null) {
			this.onerror(this);
		}
	}

	destroy() {
		this.loaderManager =
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