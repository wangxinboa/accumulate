import { Matrix } from "../../../../maths/matrix/Matrix.js";
import { Rectangle } from "../../../../maths/shapes/Rectangle.js";
import { CLEAR } from "../../gl/const.js";
import { calculateProjection } from "../../gpu/renderTarget/calculateProjection.js";
import { CanvasSource } from "../texture/sources/CanvasSource.js";
import { TextureSource } from "../texture/sources/TextureSource.js";
import { Texture } from "../texture/Texture.js";
import { getCanvasTexture } from "../texture/utils/getCanvasTexture.js";
import { isRenderingToScreen } from "./isRenderingToScreen.js";
import { RenderTarget } from "./RenderTarget.js";

const renderTargetSystem = {
	rootViewPort: new Rectangle(),
	viewport: new Rectangle(),
	onRenderTargetChange: {},
	projectionMatrix: new Matrix(),
	defaultClearColor: [0, 0, 0, 0],
	_renderSurfaceToRenderTargetHash: new Map(),
	_gpuRenderTargetHash: {},
	_renderTargetStack: [],

	new(renderer) {
		this._renderer = renderer;
		return this;
	},
	renderStart({ target, clear, clearColor, frame }) {
		this._renderTargetStack.length = 0;
		this.push(target, clear, clearColor, frame);
		this.rootViewPort.copyFrom(this.viewport);
		this.rootRenderTarget = this.renderTarget;
		this.renderingToScreen = isRenderingToScreen(this.rootRenderTarget);
		this.adaptor.prerender?.(this.rootRenderTarget);
	},
	push(renderSurface, clear = CLEAR.ALL, clearColor, frame) {
		const renderTarget = this.bind(renderSurface, clear, clearColor, frame);
		this._renderTargetStack.push({
			renderTarget,
			frame,
		});
		return renderTarget;
	},
	bind(renderSurface, clear = true, clearColor, frame) {
		const renderTarget = this.getRenderTarget(renderSurface);
		const didChange = this.renderTarget !== renderTarget;
		this.renderTarget = renderTarget;
		this.renderSurface = renderSurface;
		const gpuRenderTarget = this.getGpuRenderTarget(renderTarget);
		if (renderTarget.pixelWidth !== gpuRenderTarget.width || renderTarget.pixelHeight !== gpuRenderTarget.height) {
			this.adaptor.resizeGpuRenderTarget(renderTarget);
			gpuRenderTarget.width = renderTarget.pixelWidth;
			gpuRenderTarget.height = renderTarget.pixelHeight;
		}
		const source = renderTarget.colorTexture;
		const viewport = this.viewport;
		const pixelWidth = source.pixelWidth;
		const pixelHeight = source.pixelHeight;
		if (!frame && renderSurface instanceof Texture) {
			frame = renderSurface.frame;
		}
		if (frame) {
			const resolution = source._resolution;
			viewport.x = (frame.x * resolution + 0.5) | 0;
			viewport.y = (frame.y * resolution + 0.5) | 0;
			viewport.width = (frame.width * resolution + 0.5) | 0;
			viewport.height = (frame.height * resolution + 0.5) | 0;
		} else {
			viewport.x = 0;
			viewport.y = 0;
			viewport.width = pixelWidth;
			viewport.height = pixelHeight;
		}
		calculateProjection(
			this.projectionMatrix,
			0,
			0,
			viewport.width / source.resolution,
			viewport.height / source.resolution,
			!renderTarget.isRoot,
		);
		this.adaptor.startRenderPass(renderTarget, clear, clearColor, viewport);
		// if (didChange) {
		// 	this.onRenderTargetChange.emit(renderTarget);
		// }
		return renderTarget;
	},
	getRenderTarget(renderSurface) {
		if (renderSurface.isTexture) {
			renderSurface = renderSurface.source;
		}
		return this._renderSurfaceToRenderTargetHash.get(renderSurface) ?? this._initRenderTarget(renderSurface);
	},
	_initRenderTarget(renderSurface) {
		let renderTarget = null;
		if (CanvasSource.test(renderSurface)) {
			renderSurface = getCanvasTexture(renderSurface).source;
		}
		if (renderSurface instanceof RenderTarget) {
			renderTarget = renderSurface;
		} else if (renderSurface instanceof TextureSource) {
			renderTarget = new RenderTarget({
				colorTextures: [renderSurface],
			});
			if (CanvasSource.test(renderSurface.source.resource)) {
				renderTarget.isRoot = true;
			}
			renderSurface.once("destroy", () => {
				renderTarget.destroy();
				this._renderSurfaceToRenderTargetHash.delete(renderSurface);
				const gpuRenderTarget = this._gpuRenderTargetHash[renderTarget.uid];
				if (gpuRenderTarget) {
					this._gpuRenderTargetHash[renderTarget.uid] = null;
					this.adaptor.destroyGpuRenderTarget(gpuRenderTarget);
				}
			});
		}
		this._renderSurfaceToRenderTargetHash.set(renderSurface, renderTarget);
		return renderTarget;
	},
	getGpuRenderTarget(renderTarget) {
		return (
			this._gpuRenderTargetHash[renderTarget.uid] ||
			(this._gpuRenderTargetHash[renderTarget.uid] = this.adaptor.initGpuRenderTarget(renderTarget))
		);
	},
};

export default renderTargetSystem;
