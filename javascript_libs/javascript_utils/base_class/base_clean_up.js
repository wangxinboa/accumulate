export class BaseCleanUp {
	clean() {
		for (let key in this) {
			/** @type {any} */ (this)[key] = null;
		}
	}
	destroy() {
		for (let key in this) {
			/** @type {any} */ (this)[key] = null;
			delete this[key];
		}
	}
}
