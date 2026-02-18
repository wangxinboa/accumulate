import { DOMAdapter } from "../../../../environment/adapter.js";
import { Rectangle } from "../../../../maths/shapes/Rectangle.js";
import { getCanvasTexture } from "../texture/utils/getCanvasTexture.js";
import { RenderTarget } from "../renderTarget/RenderTarget.js";

const viewSystem = {
	defaultOptions: {
		width: 800,
		height: 600,
		antialias: false,
	},
	init(options) {
		options = {
			...viewSystem.defaultOptions,
			...options,
		};

		this.screen = new Rectangle(0, 0, options.width, options.height);
		this.canvas = options.canvas || DOMAdapter.get().createCanvas();
		this.antialias = !!options.antialias;
		this.texture = getCanvasTexture(this.canvas, options);
		this.renderTarget = new RenderTarget({
			colorTextures: [this.texture],
			depth: !!options.depth,
			isRoot: true,
		});
		this.texture.source.transparent = options.backgroundAlpha < 1;
		this.resolution = options.resolution;
	},

	resize(desiredScreenWidth, desiredScreenHeight, resolution) {
		this.texture.source.resize(desiredScreenWidth, desiredScreenHeight, resolution);
		this.screen.width = this.texture.frame.width;
		this.screen.height = this.texture.frame.height;
	},
};

export default viewSystem;
