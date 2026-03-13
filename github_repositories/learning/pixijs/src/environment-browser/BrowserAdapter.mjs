"use strict";
const BrowserAdapter = {
	/**
	 *
	 * @param {number} width
	 * @param {number} height
	 * @returns {HTMLCanvasElement}
	 */
	createCanvas: (width, height) => {
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		return canvas;
	},
	getCanvasRenderingContext2D: () => CanvasRenderingContext2D,
	getWebGLRenderingContext: () => WebGLRenderingContext,
	getNavigator: () => navigator,
	getBaseUrl: () => document.baseURI ?? window.location.href,
	getFontFaceSet: () => document.fonts,
	/**
	 *
	 * @param {string} url
	 * @param {RequestInit} options
	 * @returns {Promise<Response>}
	 */
	fetch: (url, options) => fetch(url, options),
	/**
	 *
	 * @param {string} xml
	 * @returns {Document}
	 */
	parseXML: (xml) => {
		const parser = new DOMParser();
		return parser.parseFromString(xml, "text/xml");
	},
};

export { BrowserAdapter };
//# sourceMappingURL=BrowserAdapter.mjs.map
