import renderer from "../WebGLRenderer.js";
import glRenderTargetSystem from "./GlRenderTargetSystem.js";
import { Rectangle } from "../../../../maths/shapes/Rectangle.js";
import { GlRenderTarget } from "../GlRenderTarget.js";
import { CanvasSource } from "../../shared/texture/sources/CanvasSource.js";
import { CLEAR } from "../const.js";

const glRenderTargetAdaptor = {
	_clearColorCache: [0, 0, 0, 0],
	_viewPortCache: new Rectangle(),

	initGpuRenderTarget(renderTarget) {
		const gl = renderer.gl;
		const glRenderTarget = new GlRenderTarget();
		const colorTexture = renderTarget.colorTexture;
		if (CanvasSource.test(colorTexture.resource)) {
			renderer.context.ensureCanvasSize(renderTarget.colorTexture.resource);
			glRenderTarget.framebuffer = null;
			return glRenderTarget;
		}
		this._initColor(renderTarget, glRenderTarget);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		return glRenderTarget;
	},
	startRenderPass(renderTarget, clear = true, clearColor, viewport) {
		const renderTargetSystem = glRenderTargetSystem;
		const source = renderTarget.colorTexture;
		const gpuRenderTarget = renderTargetSystem.getGpuRenderTarget(renderTarget);
		let viewPortY = viewport.y;
		if (renderTarget.isRoot) {
			viewPortY = source.pixelHeight - viewport.height;
		}
		renderTarget.colorTextures.forEach((texture) => {
			renderer.texture.unbind(texture);
		});
		const gl = renderer.gl;
		gl.bindFramebuffer(gl.FRAMEBUFFER, gpuRenderTarget.framebuffer);
		const viewPortCache = this._viewPortCache;
		if (
			viewPortCache.x !== viewport.x ||
			viewPortCache.y !== viewPortY ||
			viewPortCache.width !== viewport.width ||
			viewPortCache.height !== viewport.height
		) {
			viewPortCache.x = viewport.x;
			viewPortCache.y = viewPortY;
			viewPortCache.width = viewport.width;
			viewPortCache.height = viewport.height;
			gl.viewport(viewport.x, viewPortY, viewport.width, viewport.height);
		}
		if (!gpuRenderTarget.depthStencilRenderBuffer && (renderTarget.stencil || renderTarget.depth)) {
			this._initStencil(gpuRenderTarget);
		}
		this.clear(renderTarget, clear, clearColor);
	},
	resizeGpuRenderTarget(renderTarget) {
		if (renderTarget.isRoot) return;
		const glRenderTarget = renderTargetSystem.getGpuRenderTarget(renderTarget);
		this._resizeColor(renderTarget, glRenderTarget);
		if (renderTarget.stencil || renderTarget.depth) {
			this._resizeStencil(glRenderTarget);
		}
	},
	clear(_renderTarget, clear, clearColor) {
		if (!clear) return;
		const renderTargetSystem = this._renderTargetSystem;
		if (typeof clear === "boolean") {
			clear = clear ? CLEAR.ALL : CLEAR.NONE;
		}
		const gl = renderer.gl;
		if (clear & CLEAR.COLOR) {
			clearColor ?? (clearColor = renderTargetSystem.defaultClearColor);
			const clearColorCache = this._clearColorCache;
			const clearColorArray = clearColor;
			if (
				clearColorCache[0] !== clearColorArray[0] ||
				clearColorCache[1] !== clearColorArray[1] ||
				clearColorCache[2] !== clearColorArray[2] ||
				clearColorCache[3] !== clearColorArray[3]
			) {
				clearColorCache[0] = clearColorArray[0];
				clearColorCache[1] = clearColorArray[1];
				clearColorCache[2] = clearColorArray[2];
				clearColorCache[3] = clearColorArray[3];
				gl.clearColor(clearColorArray[0], clearColorArray[1], clearColorArray[2], clearColorArray[3]);
			}
		}
		gl.clear(clear);
	},
};

export default glRenderTargetAdaptor;
