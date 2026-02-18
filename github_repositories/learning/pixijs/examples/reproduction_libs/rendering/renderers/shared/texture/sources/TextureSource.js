import EventEmitter from "eventemitter3";
import { isPow2 } from "../../../../../maths/misc/pow2.js";
import { definedProps } from "../../../../../scene/container/utils/definedProps.js";
import { uid } from "../../../../../utils/data/uid.js";
import { TextureStyle } from "../TextureStyle.js";

export class TextureSource extends EventEmitter {
	constructor(options = {}) {
		super();
		this.options = options;
		this.uid = uid("textureSource");
		this._resourceType = "textureSource";
		this._resourceId = uid("resource");
		this.uploadMethodId = "unknown";
		this._resolution = 1;
		this.pixelWidth = 1;
		this.pixelHeight = 1;
		this.width = 1;
		this.height = 1;
		this.sampleCount = 1;
		this.mipLevelCount = 1;
		this.autoGenerateMipmaps = false;
		this.format = "rgba8unorm";
		this.dimension = "2d";
		this.antialias = false;
		this._touched = 0;

		this._batchTick = -1;

		this._textureBindLocation = -1;
		options = { ...TextureSource.defaultOptions, ...options };
		this.label = options.label ?? "";
		this.resource = options.resource;
		this.autoGarbageCollect = options.autoGarbageCollect;
		this._resolution = options.resolution;
		if (options.width) {
			this.pixelWidth = options.width * this._resolution;
		} else {
			this.pixelWidth = this.resource ? (this.resourceWidth ?? 1) : 1;
		}
		if (options.height) {
			this.pixelHeight = options.height * this._resolution;
		} else {
			this.pixelHeight = this.resource ? (this.resourceHeight ?? 1) : 1;
		}
		this.width = this.pixelWidth / this._resolution;
		this.height = this.pixelHeight / this._resolution;
		this.format = options.format;
		this.dimension = options.dimensions;
		this.mipLevelCount = options.mipLevelCount;
		this.autoGenerateMipmaps = options.autoGenerateMipmaps;
		this.sampleCount = options.sampleCount;
		this.antialias = options.antialias;
		this.alphaMode = options.alphaMode;
		this.style = new TextureStyle(definedProps(options));
		this.destroyed = false;
		this._refreshPOT();
	}

	get source() {
		return this;
	}
	get style() {
		return this._style;
	}
	set style(value) {
		if (this.style === value) return;
		this._style?.off("change", this._onStyleChange, this);
		this._style = value;
		this._style?.on("change", this._onStyleChange, this);
		this._onStyleChange();
	}
	get addressMode() {
		return this._style.addressMode;
	}
	set addressMode(value) {
		this._style.addressMode = value;
	}

	get repeatMode() {
		return this._style.addressMode;
	}
	set repeatMode(value) {
		this._style.addressMode = value;
	}

	get magFilter() {
		return this._style.magFilter;
	}
	set magFilter(value) {
		this._style.magFilter = value;
	}

	get minFilter() {
		return this._style.minFilter;
	}
	set minFilter(value) {
		this._style.minFilter = value;
	}

	get mipmapFilter() {
		return this._style.mipmapFilter;
	}
	set mipmapFilter(value) {
		this._style.mipmapFilter = value;
	}

	get lodMinClamp() {
		return this._style.lodMinClamp;
	}
	set lodMinClamp(value) {
		this._style.lodMinClamp = value;
	}

	get lodMaxClamp() {
		return this._style.lodMaxClamp;
	}
	set lodMaxClamp(value) {
		this._style.lodMaxClamp = value;
	}
	_onStyleChange() {
		this.emit("styleChange", this);
	}

	update() {
		if (this.resource) {
			const resolution = this._resolution;
			const didResize = this.resize(this.resourceWidth / resolution, this.resourceHeight / resolution);
			if (didResize) return;
		}
		this.emit("update", this);
	}

	destroy() {
		this.destroyed = true;
		this.emit("destroy", this);
		this.emit("change", this);
		if (this._style) {
			this._style.destroy();
			this._style = null;
		}
		this.uploadMethodId = null;
		this.resource = null;
		this.removeAllListeners();
	}

	unload() {
		this._resourceId = uid("resource");
		this.emit("change", this);
		this.emit("unload", this);
	}

	get resourceWidth() {
		const { resource } = this;
		return resource.naturalWidth || resource.videoWidth || resource.displayWidth || resource.width;
	}

	get resourceHeight() {
		const { resource } = this;
		return resource.naturalHeight || resource.videoHeight || resource.displayHeight || resource.height;
	}

	get resolution() {
		return this._resolution;
	}
	set resolution(resolution) {
		if (this._resolution === resolution) return;
		this._resolution = resolution;
		this.width = this.pixelWidth / resolution;
		this.height = this.pixelHeight / resolution;
	}

	resize(width, height, resolution) {
		resolution || (resolution = this._resolution);
		width || (width = this.width);
		height || (height = this.height);
		const newPixelWidth = Math.round(width * resolution);
		const newPixelHeight = Math.round(height * resolution);
		this.width = newPixelWidth / resolution;
		this.height = newPixelHeight / resolution;
		this._resolution = resolution;
		if (this.pixelWidth === newPixelWidth && this.pixelHeight === newPixelHeight) {
			return false;
		}
		this._refreshPOT();
		this.pixelWidth = newPixelWidth;
		this.pixelHeight = newPixelHeight;
		this.emit("resize", this);
		this._resourceId = uid("resource");
		this.emit("change", this);
		return true;
	}

	updateMipmaps() {
		if (this.autoGenerateMipmaps && this.mipLevelCount > 1) {
			this.emit("updateMipmaps", this);
		}
	}
	set wrapMode(value) {
		this._style.wrapMode = value;
	}
	get wrapMode() {
		return this._style.wrapMode;
	}
	set scaleMode(value) {
		this._style.scaleMode = value;
	}

	get scaleMode() {
		return this._style.scaleMode;
	}

	_refreshPOT() {
		this.isPowerOfTwo = isPow2(this.pixelWidth) && isPow2(this.pixelHeight);
	}
	static test(_resource) {
		throw new Error("Unimplemented");
	}
}

TextureSource.defaultOptions = {
	resolution: 1,
	format: "bgra8unorm",
	alphaMode: "premultiply-alpha-on-upload",
	dimensions: "2d",
	mipLevelCount: 1,
	autoGenerateMipmaps: false,
	sampleCount: 1,
	antialias: false,
	autoGarbageCollect: false,
};
