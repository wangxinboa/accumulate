/**
 * @param {HTMLCanvasElement} canvas
 * @param {number} width
 * @param {number} height
 * @param {number} devicePixelRatio
 */
export function scaleCanvas(canvas, width, height, devicePixelRatio = window.devicePixelRatio) {
	canvas.width = width * devicePixelRatio;
	canvas.height = height * devicePixelRatio;

	canvas.style.width = `${width}px`;
	canvas.style.height = `${height}px`;
}
/**
 * @param {HTMLCanvasElement} canvas
 * @param {number} devicePixelRatio
 */
export function resizeCanvas(canvas, devicePixelRatio = window.devicePixelRatio) {
	const containerDom = canvas.parentElement;

	if (containerDom) {
		scaleCanvas(canvas, containerDom.clientWidth, containerDom.clientHeight, devicePixelRatio);
	} else {
		throw new Error("resizeCanvas 时, canvas 不存在父节点 dom, 无法获取父节点宽高");
	}
}
