const params = new URLSearchParams(window.location.search);

/**
 * @param {string} key
 */
export function getUrlSearchParam(key) {
	return params.get(key);
}
