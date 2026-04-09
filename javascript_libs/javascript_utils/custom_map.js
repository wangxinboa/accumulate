import { BaseCleanUp } from "./javascript_utils.js";

/**
 * @template T
 */
export class CustomMap extends BaseCleanUp {
	/** @private @type {boolean} */
	_enableOverwrite;
	/** @type {Record<string | number, T>} */
	map;
	/** @type {Array<T>} */
	array;

	constructor() {
		super();

		this._enableOverwrite = true;
		/** @type {Record<string | number, T>} */
		this.map = {};
		/** @type {T[]} */
		this.array = [];
	}

	enableOverwrite() {
		this._enableOverwrite = true;
		return this;
	}
	disableOverwrite() {
		this._enableOverwrite = false;
		return this;
	}
	/**
	 * @param {string | number} key
	 * @param {T} value
	 * @returns {CustomMap<T>}
	 */
	set(key, value) {
		if (this._enableOverwrite && this.has(key)) {
			throw new Error(`CustomMap 中键 ${key} 已存在，且禁止覆盖`);
		}

		this.delete(key);

		this.map[key] = value;
		this.array.push(value);

		return this;
	}
	/**
	 * @param {string | number} key
	 * @returns {T}
	 */
	get(key) {
		return this.map[key];
	}
	/**
	 * @param {string | number} key
	 * @returns {T}
	 */
	confirmedExistGet(key) {
		if (this.has(key)) {
			return this.map[key];
		}
		throw new Error(`CustomMap 中键 ${key} 不存在`);
	}
	/**
	 * @param {string | number} key
	 * @returns {boolean}
	 */
	has(key) {
		return this.map.hasOwnProperty(key);
	}
	/**
	 * @param {string | number} key
	 * @returns {CustomMap<T>}
	 */
	delete(key) {
		if (this.has(key)) {
			const value = this.map[key];
			const index = this.array.indexOf(value);

			this.array.splice(index, 1);
			delete this.map[key];
		}
		return this;
	}
	clear() {
		for (let key in this.map) {
			delete this.map[key];
		}
		this.array.length = 0;

		return this;
	}

	destroy() {
		this.clear();

		super.destroy();
	}
}
