import contextSystem from "../context/GlContextSystem.js";
import { GlTexture } from "./GlTexture.js";
import { glUploadImageResource } from "./uploaders/glUploadImageResource.js";
import { applyStyleParams } from "./utils/applyStyleParams.js";
import { mapFormatToGlFormat } from "./utils/mapFormatToGlFormat.js";
import { mapFormatToGlInternalFormat } from "./utils/mapFormatToGlInternalFormat.js";
import { mapFormatToGlType } from "./utils/mapFormatToGlType.js";

const textureSystem = {
	managedTextures: [],
	_glTextures: {},
	_glSamplers: {},
	_boundTextures: [],
	_activeTextureLocation: -1,
	_boundSamplers: {},
	_uploads: {
		image: glUploadImageResource,
	},
	_premultiplyAlpha: false,
	_useSeparateSamplers: false,

	new(renderer) {
		this._renderer = renderer;
		return this;
	},
	contextChange(gl) {
		this._gl = gl;
		if (!this._mapFormatToInternalFormat) {
			this._mapFormatToInternalFormat = mapFormatToGlInternalFormat(gl, contextSystem.extensions);
			this._mapFormatToType = mapFormatToGlType(gl);
			this._mapFormatToFormat = mapFormatToGlFormat(gl);
		}
		this._glTextures = {};
		this._glSamplers = {};
		this._boundSamplers = {};
		this._premultiplyAlpha = false;
	},
	bind(texture, location = 0) {
		const source = texture.source;
		if (texture) {
			this.bindSource(source, location);
			if (this._useSeparateSamplers) {
				this._bindSampler(source.style, location);
			}
		} else {
			this.bindSource(null, location);
			if (this._useSeparateSamplers) {
				this._bindSampler(null, location);
			}
		}
	},
	bindSource(source, location = 0) {
		const gl = this._gl;
		// source._touched = this._renderer.textureGC.count;
		if (this._boundTextures[location] !== source) {
			this._boundTextures[location] = source;
			this._activateLocation(location);
			source || (source = Texture.EMPTY.source);
			const glTexture = this.getGlSource(source);
			gl.bindTexture(glTexture.target, glTexture.texture);
		}
	},
	unbind(texture) {
		const source = texture.source;
		const boundTextures = this._boundTextures;
		const gl = this._gl;
		for (let i = 0; i < boundTextures.length; i++) {
			if (boundTextures[i] === source) {
				this._activateLocation(i);
				const glTexture = this.getGlSource(source);
				gl.bindTexture(glTexture.target, null);
				boundTextures[i] = null;
			}
		}
	},
	_activateLocation(location) {
		if (this._activeTextureLocation !== location) {
			this._activeTextureLocation = location;
			this._gl.activeTexture(this._gl.TEXTURE0 + location);
		}
	},
	_initSource(source) {
		const gl = this._gl;
		const glTexture = new GlTexture(gl.createTexture());
		glTexture.type = this._mapFormatToType[source.format];
		glTexture.internalFormat = this._mapFormatToInternalFormat[source.format];
		glTexture.format = this._mapFormatToFormat[source.format];
		if (source.autoGenerateMipmaps && (this._renderer.context.supports.nonPowOf2mipmaps || source.isPowerOfTwo)) {
			const biggestDimension = Math.max(source.width, source.height);
			source.mipLevelCount = Math.floor(Math.log2(biggestDimension)) + 1;
		}
		this._glTextures[source.uid] = glTexture;
		if (!this.managedTextures.includes(source)) {
			// source.on("update", this.onSourceUpdate, this);
			// source.on("resize", this.onSourceUpdate, this);
			// source.on("styleChange", this.onStyleChange, this);
			// source.on("destroy", this.onSourceDestroy, this);
			// source.on("unload", this.onSourceUnload, this);
			// source.on("updateMipmaps", this.onUpdateMipmaps, this);
			// this.managedTextures.push(source);
		}
		this.onSourceUpdate(source);
		this.updateStyle(source, false);
		return glTexture;
	},
	updateStyle(source, firstCreation) {
		const gl = this._gl;
		const glTexture = this.getGlSource(source);
		gl.bindTexture(gl.TEXTURE_2D, glTexture.texture);
		this._boundTextures[this._activeTextureLocation] = source;
		applyStyleParams(
			source.style,
			gl,
			source.mipLevelCount > 1,
			this._renderer.context.extensions.anisotropicFiltering,
			"texParameteri",
			gl.TEXTURE_2D,
			// will force a clamp to edge if the texture is not a power of two
			!this._renderer.context.supports.nonPowOf2wrapping && !source.isPowerOfTwo,
			firstCreation,
		);
	},
	onSourceUpdate(source) {
		const gl = this._gl;
		const glTexture = this.getGlSource(source);
		gl.bindTexture(gl.TEXTURE_2D, glTexture.texture);
		this._boundTextures[this._activeTextureLocation] = source;
		const premultipliedAlpha = source.alphaMode === "premultiply-alpha-on-upload";
		if (this._premultiplyAlpha !== premultipliedAlpha) {
			this._premultiplyAlpha = premultipliedAlpha;
			gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultipliedAlpha);
		}
		if (this._uploads[source.uploadMethodId]) {
			this._uploads[source.uploadMethodId].upload(source, glTexture, gl, this._renderer.context.webGLVersion);
		} else {
			gl.texImage2D(
				gl.TEXTURE_2D,
				0,
				gl.RGBA,
				source.pixelWidth,
				source.pixelHeight,
				0,
				gl.RGBA,
				gl.UNSIGNED_BYTE,
				null,
			);
		}
		if (source.autoGenerateMipmaps && source.mipLevelCount > 1) {
			this.onUpdateMipmaps(source, false);
		}
	},
	getGlSource(source) {
		return this._glTextures[source.uid] || this._initSource(source);
	},
};

export default textureSystem;
