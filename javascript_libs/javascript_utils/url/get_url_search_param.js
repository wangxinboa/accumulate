const params = new URLSearchParams(window.location.search);

/**
 * @param {string} key
 */
export function getInitUrlSearchParam(key) {
	return params.get(key);
}
