/**
 * @param {HTMLCanvasElement} canvas
 * @param {number} devicePixelRatio
 * @param {number} width
 * @param {number} height
 */
export function scaleCanvas(canvas, devicePixelRatio, width, height) {
	canvas.width = width * devicePixelRatio;
	canvas.height = height * devicePixelRatio;

	canvas.style.width = `${width}px`;
	canvas.style.height = `${height}px`;
}
/**
 * @param {HTMLCanvasElement} canvas
 * @param {number} devicePixelRatio
 */
export function resizeCanvas(canvas, devicePixelRatio) {
	const containerDom = canvas.parentElement;

	if (containerDom) {
		scaleCanvas(canvas, devicePixelRatio, containerDom.scrollWidth, containerDom.scrollHeight);
	} else {
		console.warn("resizeCanvas 时, canvas 不存在父节点 dom, 无法获取父节点宽高");
	}
}
