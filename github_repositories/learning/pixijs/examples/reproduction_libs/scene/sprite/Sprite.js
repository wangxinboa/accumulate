import { ObservablePoint } from "../../maths/point/ObservablePoint.js";
import { Texture } from "../../rendering/renderers/shared/texture/Texture.js";
import { updateQuadBounds } from "../../utils/data/updateQuadBounds.js";
import { ViewContainer } from "../view/ViewContainer.js";

export class Sprite extends ViewContainer {
	constructor(options = Texture.EMPTY) {
		if (options instanceof Texture) {
			options = { texture: options };
		}
		const { texture = Texture.EMPTY, anchor, roundPixels, width, height, ...rest } = options;
		super({
			label: "Sprite",
			...rest,
		});
		this.renderPipeId = "sprite";
		this.batched = true;
		this._visualBounds = { minX: 0, maxX: 1, minY: 0, maxY: 0 };
		this._anchor = new ObservablePoint({
			_onUpdate: () => {
				this.onViewUpdate();
			},
		});
		if (anchor) {
			this.anchor = anchor;
		} else if (texture.defaultAnchor) {
			this.anchor = texture.defaultAnchor;
		}
		this.texture = texture;
		this.allowChildren = false;
		this.roundPixels = roundPixels ?? false;
		if (width !== void 0) this.width = width;
		if (height !== void 0) this.height = height;
	}
	set texture(value) {
		value || (value = Texture.EMPTY);
		const currentTexture = this._texture;
		if (currentTexture === value) return;
		if (currentTexture && currentTexture.dynamic) currentTexture.off("update", this.onViewUpdate, this);
		if (value.dynamic) value.on("update", this.onViewUpdate, this);
		this._texture = value;
		if (this._width) {
			this._setWidth(this._width, this._texture.orig.width);
		}
		if (this._height) {
			this._setHeight(this._height, this._texture.orig.height);
		}
		this.onViewUpdate();
	}
	get texture() {
		return this._texture;
	}
	get visualBounds() {
		updateQuadBounds(this._visualBounds, this._anchor, this._texture);
		return this._visualBounds;
	}
	get sourceBounds() {
		return this.visualBounds;
	}
	get anchor() {
		return this._anchor;
	}
	set anchor(value) {
		typeof value === "number" ? this._anchor.set(value) : this._anchor.copyFrom(value);
	}
}
