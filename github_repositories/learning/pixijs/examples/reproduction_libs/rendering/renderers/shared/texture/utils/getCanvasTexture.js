import { CanvasSource } from "../sources/CanvasSource.js";
import { Texture } from "../Texture.js";

("use strict");
const canvasCache = /* @__PURE__ */ new Map();
function getCanvasTexture(canvas, options) {
	if (!canvasCache.has(canvas)) {
		const texture = new Texture({
			source: new CanvasSource({
				resource: canvas,
				...options,
			}),
		});
		const onDestroy = () => {
			if (canvasCache.get(canvas) === texture) {
				canvasCache.delete(canvas);
			}
		};
		texture.once("destroy", onDestroy);
		texture.source.once("destroy", onDestroy);
		canvasCache.set(canvas, texture);
	}
	return canvasCache.get(canvas);
}

function hasCachedCanvasTexture(canvas) {
	return canvasCache.has(canvas);
}

export { getCanvasTexture, hasCachedCanvasTexture };
