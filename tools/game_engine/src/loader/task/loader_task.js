import EventEmitter from '../../event/event_emitter.js';
import loaderManager from '../loader_manager.js';

// const TaskState = {
// 	wait: 'wait',
// 	loading: 'loading',
// 	loaded: 'loaded',
// 	error: 'error',
// }

const onLoadedEventName = 'onloaded';
const onErrorEventName = 'onerror';


export default class LoaderTask extends EventEmitter {
	constructor(onloaded, onerror, key) {
		super();

		this.taskIndex = loaderManager.totalTaskCount;
		this.key = key;

		this.isWait = true;
		this.isLoading = false;
		this.isLoaded = false;
		this.isError = false;

		this.errorTime = 0;

		this.loaded = this.loaded.bind(this);
		this.error = this.error.bind(this);

		this.wait(onloaded, onerror);
	}

	wait(onloaded, onerror) {
		if (onloaded) {
			this.once(onLoadedEventName, onloaded);
		}
		if (onerror) {
			this.once(onErrorEventName, onerror);
		}
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

		this.emit(onLoadedEventName, this);
		this.removeAllListeners();
	}
	error() {
		this.errorTime++;
		loaderManager._onTaskError(this);
	}

	confirmError() {
		this.isWait = false;
		this.isLoading = false;
		this.isLoaded = false;
		this.isError = true;

		this.emit(onErrorEventName, this);
		this.removeAllListeners();
	}

	destroy() {
		super.destroy();

		this.taskIndex =
			this.key =

			this.isWait =
			this.isLoading =
			this.isLoaded =
			this.isError =

			this.errorTime =

			this.loaded =
			this.error = null;

		delete this.taskIndex;
		delete this.key;

		delete this.isWait;
		delete this.isLoading;
		delete this.isLoaded;
		delete this.isError;

		delete this.errorTime;

		delete this.loaded;
		delete this.error;
	}
}