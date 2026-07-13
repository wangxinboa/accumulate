import { BaseTask } from "./base_task.js";
import { fetchJson } from "../../fetch/fetch_json.js";

/**
 * JSON 加载任务，继承 BaseTask。
 * 使用 fetchJson 工具发起请求，数据存储于 data 属性。
 * 支持自动重试（由 BaseTask 的 errorTime / maxErrorTime 控制）。
 * @template T
 */
export class JsonTask extends BaseTask {
	/**
	 * 解析后的 JSON 数据
	 * @type {T | null}
	 */
	data = null;
	/**
	 * fetch 请求附加选项
	 * @type {RequestInit | undefined}
	 */
	options = undefined;

	/**
	 * @param {string} url - JSON 资源地址（同时作为任务唯一 key）
	 * @param {RequestInit} [options] - fetch 附加选项
	 */
	constructor(url, options) {
		super(url);
		this.options = options;

		// 预先绑定回调，避免每次 startLoad 重新创建函数
		this._onFetchSuccess = this._onFetchSuccess.bind(this);
		this._onFetchError = this._onFetchError.bind(this);
	}

	/**
	 * fetchJson 成功回调
	 * @private
	 * @param {T} data
	 */
	_onFetchSuccess(data) {
		this.data = data;
		this.onload();
	}

	/**
	 * fetchJson 失败回调，触发 BaseTask 重试机制
	 * @private
	 */
	_onFetchError() {
		this.onerror();
	}

	/**
	 * 开始加载任务
	 * @returns {this}
	 */
	startLoad() {
		fetchJson(this.key, this.options).then(this._onFetchSuccess).catch(this._onFetchError);

		return this;
	}
}
