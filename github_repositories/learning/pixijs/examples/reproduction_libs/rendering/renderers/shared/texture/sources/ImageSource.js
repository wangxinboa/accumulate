import { DOMAdapter } from "../../../../../environment/adapter.js";
import { TextureSource } from "./TextureSource.js";

class ImageSource extends TextureSource {
	constructor(options) {
		if (options.resource && globalThis.HTMLImageElement && options.resource instanceof HTMLImageElement) {
			const canvas = DOMAdapter.get().createCanvas(options.resource.width, options.resource.height);
			const context = canvas.getContext("2d");
			context.drawImage(options.resource, 0, 0, options.resource.width, options.resource.height);
			options.resource = canvas;
			console.warn("ImageSource: Image element passed, converting to canvas. Use CanvasSource instead.");
		}
		super(options);
		this.uploadMethodId = "image";
		this.autoGarbageCollect = true;
	}
	static test(resource) {
		return (
			(globalThis.HTMLImageElement && resource instanceof HTMLImageElement) ||
			(typeof ImageBitmap !== "undefined" && resource instanceof ImageBitmap) ||
			(globalThis.VideoFrame && resource instanceof VideoFrame)
		);
	}
}

export { ImageSource };
