/**
 * 处理 HTTP 响应：校验状态码，并解析为 JSON。
 * 失败时抛出错误，由调用方处理（错误信息包含状态码）。
 *
 * @param {Response} response - fetch 返回的响应对象
 * @returns {Promise<any>} 解析后的 JSON 数据
 */
export function parseJsonResponse(response) {
	if (!response.ok) {
		throw new Error("HTTP error! status: " + response.status);
	}
	return response.json();
}

/**
 * 发起 fetch 请求并解析 JSON。
 * 本函数不处理重试逻辑，仅负责单次请求。
 *
 * @param {string} url - 请求地址
 * @param {RequestInit} [options] - fetch 的第二个参数
 * @returns {Promise<any>} 解析后的 JSON 数据
 */
export function fetchJson(url, options) {
	return fetch(url, options).then(parseJsonResponse);
}
