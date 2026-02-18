import EventEmitter from "eventemitter3";
// import { Color } from "../../color/Color.js";
// import { cullingMixin } from "../../culling/cullingMixin.js";
import { extensions } from "../../extensions/Extensions.js";
import { Matrix } from "../../maths/matrix/Matrix.js";
// import { RAD_TO_DEG, DEG_TO_RAD } from "../../maths/misc/const.js";
import { ObservablePoint } from "../../maths/point/ObservablePoint.js";
import { uid } from "../../utils/data/uid.js";
// import { deprecation, v8_0_0 } from "../../utils/logging/deprecation.js";
// import { BigPool } from "../../utils/pool/PoolGroup.js";
// import { cacheAsTextureMixin } from "./container-mixins/cacheAsTextureMixin.js";
// import { childrenHelperMixin } from "./container-mixins/childrenHelperMixin.js";
import { collectRenderablesMixin } from "./container-mixins/collectRenderablesMixin.js";
// import { effectsMixin } from "./container-mixins/effectsMixin.js";
// import { findMixin } from "./container-mixins/findMixin.js";
// import { getFastGlobalBoundsMixin } from "./container-mixins/getFastGlobalBoundsMixin.js";
// import { bgr2rgb, getGlobalMixin } from "./container-mixins/getGlobalMixin.js";
// import { measureMixin } from "./container-mixins/measureMixin.js";
// import { onRenderMixin } from "./container-mixins/onRenderMixin.js";
import { sortMixin } from "./container-mixins/sortMixin.js";
// import { toLocalGlobalMixin } from "./container-mixins/toLocalGlobalMixin.js";
import { RenderGroup } from "./RenderGroup.js";
import { assignWithIgnore } from "./utils/assignWithIgnore.js";

const defaultSkew = new ObservablePoint(null);
const defaultPivot = new ObservablePoint(null);
const defaultScale = new ObservablePoint(null, 1, 1);
const UPDATE_COLOR = 1;
const UPDATE_BLEND = 2;
const UPDATE_VISIBLE = 4;
const UPDATE_TRANSFORM = 8;

class Container extends EventEmitter {
	constructor(options = {}) {
		super();
		this.uid = uid("renderable");
		this._updateFlags = 15;
		this.renderGroup = null;
		this.parentRenderGroup = null;
		this.parentRenderGroupIndex = 0;
		this.didChange = false;
		this.didViewUpdate = false;
		this.relativeRenderGroupDepth = 0;
		this.children = [];
		this.parent = null;
		this.includeInBuild = true;
		this.measurable = true;
		this.isSimple = true;

		this.updateTick = -1;
		this.localTransform = new Matrix();
		this.relativeGroupTransform = new Matrix();
		this.groupTransform = this.relativeGroupTransform;
		this.destroyed = false;

		this._position = new ObservablePoint(this, 0, 0);
		this._scale = defaultScale;
		this._pivot = defaultPivot;
		this._skew = defaultSkew;
		this._cx = 1;
		this._sx = 0;
		this._cy = 0;
		this._sy = 1;
		this._rotation = 0;

		this.localColor = 16777215;
		this.localAlpha = 1;
		this.groupAlpha = 1;
		this.groupColor = 16777215;
		this.groupColorAlpha = 4294967295;

		this.localBlendMode = "inherit";
		this.groupBlendMode = "normal";
		this.localDisplayStatus = 7;
		this.globalDisplayStatus = 7;
		this._didContainerChangeTick = 0;
		this._didViewChangeTick = 0;
		this._didLocalTransformChangeId = -1;
		this.effects = [];
		assignWithIgnore(this, options, {
			children: true,
			parent: true,
			effects: true,
		});
		options.children?.forEach((child) => this.addChild(child));
		options.parent?.addChild(this);
	}
	// static mixin(source) {
	// 	deprecation("8.8.0", "Container.mixin is deprecated, please use extensions.mixin instead.");
	// 	extensions.mixin(Container, source);
	// }
	// set _didChangeId(value) {
	// 	this._didViewChangeTick = (value >> 12) & 4095;
	// 	this._didContainerChangeTick = value & 4095;
	// }
	// get _didChangeId() {
	// 	return (this._didContainerChangeTick & 4095) | ((this._didViewChangeTick & 4095) << 12);
	// }
	addChild(...children) {
		if (children.length > 1) {
			for (let i = 0; i < children.length; i++) {
				this.addChild(children[i]);
			}
			return children[0];
		}
		const child = children[0];
		const renderGroup = this.renderGroup || this.parentRenderGroup;
		if (child.parent === this) {
			this.children.splice(this.children.indexOf(child), 1);
			this.children.push(child);
			if (renderGroup) {
				renderGroup.structureDidChange = true;
			}
			return child;
		}
		if (child.parent) {
			child.parent.removeChild(child);
		}
		this.children.push(child);
		if (this.sortableChildren) this.sortDirty = true;
		child.parent = this;
		child.didChange = true;
		child._updateFlags = 15;
		if (renderGroup) {
			renderGroup.addChild(child);
		}
		this.emit("childAdded", child, this, this.children.length - 1);
		child.emit("added", this);
		this._didViewChangeTick++;
		if (child._zIndex !== 0) {
			child.depthOfChildModified();
		}
		return child;
	}
	// removeChild(...children) {
	// 	if (children.length > 1) {
	// 		for (let i = 0; i < children.length; i++) {
	// 			this.removeChild(children[i]);
	// 		}
	// 		return children[0];
	// 	}
	// 	const child = children[0];
	// 	const index = this.children.indexOf(child);
	// 	if (index > -1) {
	// 		this._didViewChangeTick++;
	// 		this.children.splice(index, 1);
	// 		if (this.renderGroup) {
	// 			this.renderGroup.removeChild(child);
	// 		} else if (this.parentRenderGroup) {
	// 			this.parentRenderGroup.removeChild(child);
	// 		}
	// 		if (child.parentRenderLayer) {
	// 			child.parentRenderLayer.detach(child);
	// 		}
	// 		child.parent = null;
	// 		this.emit("childRemoved", child, this, index);
	// 		child.emit("removed", this);
	// 	}
	// 	return child;
	// }
	_onUpdate(point) {
		if (point) {
			if (point === this._skew) {
				this._updateSkew();
			}
		}
		this._didContainerChangeTick++;
		if (this.didChange) return;
		this.didChange = true;
		if (this.parentRenderGroup) {
			this.parentRenderGroup.onChildUpdate(this);
		}
	}
	// set isRenderGroup(value) {
	// 	if (!!this.renderGroup === value) return;
	// 	if (value) {
	// 		this.enableRenderGroup();
	// 	} else {
	// 		this.disableRenderGroup();
	// 	}
	// }
	// get isRenderGroup() {
	// 	return !!this.renderGroup;
	// }
	enableRenderGroup() {
		if (this.renderGroup) return;
		const parentRenderGroup = this.parentRenderGroup;
		parentRenderGroup?.removeChild(this);
		this.renderGroup = new RenderGroup(this);

		this.renderGroup.init(this);

		this.groupTransform = Matrix.IDENTITY;
		parentRenderGroup?.addChild(this);
		this._updateIsSimple();
	}
	// disableRenderGroup() {
	// 	if (!this.renderGroup) return;
	// 	const parentRenderGroup = this.parentRenderGroup;
	// 	parentRenderGroup?.removeChild(this);
	// 	BigPool.return(this.renderGroup);
	// 	this.renderGroup = null;
	// 	this.groupTransform = this.relativeGroupTransform;
	// 	parentRenderGroup?.addChild(this);
	// 	this._updateIsSimple();
	// }
	_updateIsSimple() {
		this.isSimple = !this.renderGroup && this.effects.length === 0;
	}
	// get worldTransform() {
	// 	this._worldTransform || (this._worldTransform = new Matrix());
	// 	if (this.renderGroup) {
	// 		this._worldTransform.copyFrom(this.renderGroup.worldTransform);
	// 	} else if (this.parentRenderGroup) {
	// 		this._worldTransform.appendFrom(this.relativeGroupTransform, this.parentRenderGroup.worldTransform);
	// 	}
	// 	return this._worldTransform;
	// }
	get x() {
		return this._position.x;
	}
	set x(value) {
		this._position.x = value;
	}
	get y() {
		return this._position.y;
	}
	set y(value) {
		this._position.y = value;
	}
	get position() {
		return this._position;
	}
	set position(value) {
		this._position.copyFrom(value);
	}
	get rotation() {
		return this._rotation;
	}
	set rotation(value) {
		if (this._rotation !== value) {
			this._rotation = value;
			this._onUpdate(this._skew);
		}
	}
	get angle() {
		return this.rotation * RAD_TO_DEG;
	}
	set angle(value) {
		this.rotation = value * DEG_TO_RAD;
	}
	get pivot() {
		if (this._pivot === defaultPivot) {
			this._pivot = new ObservablePoint(this, 0, 0);
		}
		return this._pivot;
	}
	set pivot(value) {
		if (this._pivot === defaultPivot) {
			this._pivot = new ObservablePoint(this, 0, 0);
		}
		typeof value === "number" ? this._pivot.set(value) : this._pivot.copyFrom(value);
	}
	get skew() {
		if (this._skew === defaultSkew) {
			this._skew = new ObservablePoint(this, 0, 0);
		}
		return this._skew;
	}
	set skew(value) {
		if (this._skew === defaultSkew) {
			this._skew = new ObservablePoint(this, 0, 0);
		}
		this._skew.copyFrom(value);
	}
	get scale() {
		if (this._scale === defaultScale) {
			this._scale = new ObservablePoint(this, 1, 1);
		}
		return this._scale;
	}
	set scale(value) {
		if (this._scale === defaultScale) {
			this._scale = new ObservablePoint(this, 0, 0);
		}
		typeof value === "number" ? this._scale.set(value) : this._scale.copyFrom(value);
	}
	get width() {
		return Math.abs(this.scale.x * this.getLocalBounds().width);
	}
	set width(value) {
		const localWidth = this.getLocalBounds().width;
		this._setWidth(value, localWidth);
	}
	get height() {
		return Math.abs(this.scale.y * this.getLocalBounds().height);
	}
	set height(value) {
		const localHeight = this.getLocalBounds().height;
		this._setHeight(value, localHeight);
	}
	getSize(out) {
		if (!out) {
			out = {};
		}
		const bounds = this.getLocalBounds();
		out.width = Math.abs(this.scale.x * bounds.width);
		out.height = Math.abs(this.scale.y * bounds.height);
		return out;
	}
	setSize(value, height) {
		const size = this.getLocalBounds();
		if (typeof value === "object") {
			height = value.height ?? value.width;
			value = value.width;
		} else {
			height ?? (height = value);
		}
		value !== void 0 && this._setWidth(value, size.width);
		height !== void 0 && this._setHeight(height, size.height);
	}
	_updateSkew() {
		const rotation = this._rotation;
		const skew = this._skew;
		this._cx = Math.cos(rotation + skew._y);
		this._sx = Math.sin(rotation + skew._y);
		this._cy = -Math.sin(rotation - skew._x);
		this._sy = Math.cos(rotation - skew._x);
	}
	// updateTransform(opts) {
	// 	this.position.set(
	// 		typeof opts.x === "number" ? opts.x : this.position.x,
	// 		typeof opts.y === "number" ? opts.y : this.position.y,
	// 	);
	// 	this.scale.set(
	// 		typeof opts.scaleX === "number" ? opts.scaleX || 1 : this.scale.x,
	// 		typeof opts.scaleY === "number" ? opts.scaleY || 1 : this.scale.y,
	// 	);
	// 	this.rotation = typeof opts.rotation === "number" ? opts.rotation : this.rotation;
	// 	this.skew.set(
	// 		typeof opts.skewX === "number" ? opts.skewX : this.skew.x,
	// 		typeof opts.skewY === "number" ? opts.skewY : this.skew.y,
	// 	);
	// 	this.pivot.set(
	// 		typeof opts.pivotX === "number" ? opts.pivotX : this.pivot.x,
	// 		typeof opts.pivotY === "number" ? opts.pivotY : this.pivot.y,
	// 	);
	// 	return this;
	// }
	// setFromMatrix(matrix) {
	// 	matrix.decompose(this);
	// }
	updateLocalTransform() {
		const localTransformChangeId = this._didContainerChangeTick;
		if (this._didLocalTransformChangeId === localTransformChangeId) return;
		this._didLocalTransformChangeId = localTransformChangeId;
		const lt = this.localTransform;
		const scale = this._scale;
		const pivot = this._pivot;
		const position = this._position;
		const sx = scale._x;
		const sy = scale._y;
		const px = pivot._x;
		const py = pivot._y;
		lt.a = this._cx * sx;
		lt.b = this._sx * sx;
		lt.c = this._cy * sy;
		lt.d = this._sy * sy;
		lt.tx = position._x - (px * lt.a + py * lt.c);
		lt.ty = position._y - (px * lt.b + py * lt.d);
	}
	// set alpha(value) {
	// 	if (value === this.localAlpha) return;
	// 	this.localAlpha = value;
	// 	this._updateFlags |= UPDATE_COLOR;
	// 	this._onUpdate();
	// }
	// get alpha() {
	// 	return this.localAlpha;
	// }
	// set tint(value) {
	// 	const tempColor = Color.shared.setValue(value ?? 16777215);
	// 	const bgr = tempColor.toBgrNumber();
	// 	if (bgr === this.localColor) return;
	// 	this.localColor = bgr;
	// 	this._updateFlags |= UPDATE_COLOR;
	// 	this._onUpdate();
	// }
	// get tint() {
	// 	return bgr2rgb(this.localColor);
	// }
	// set blendMode(value) {
	// 	if (this.localBlendMode === value) return;
	// 	if (this.parentRenderGroup) {
	// 		this.parentRenderGroup.structureDidChange = true;
	// 	}
	// 	this._updateFlags |= UPDATE_BLEND;
	// 	this.localBlendMode = value;
	// 	this._onUpdate();
	// }
	// get blendMode() {
	// 	return this.localBlendMode;
	// }
	// get visible() {
	// 	return !!(this.localDisplayStatus & 2);
	// }
	// set visible(value) {
	// 	const valueNumber = value ? 2 : 0;
	// 	if ((this.localDisplayStatus & 2) === valueNumber) return;
	// 	if (this.parentRenderGroup) {
	// 		this.parentRenderGroup.structureDidChange = true;
	// 	}
	// 	this._updateFlags |= UPDATE_VISIBLE;
	// 	this.localDisplayStatus ^= 2;
	// 	this._onUpdate();
	// }

	// get culled() {
	// 	return !(this.localDisplayStatus & 4);
	// }
	// set culled(value) {
	// 	const valueNumber = value ? 0 : 4;
	// 	if ((this.localDisplayStatus & 4) === valueNumber) return;
	// 	if (this.parentRenderGroup) {
	// 		this.parentRenderGroup.structureDidChange = true;
	// 	}
	// 	this._updateFlags |= UPDATE_VISIBLE;
	// 	this.localDisplayStatus ^= 4;
	// 	this._onUpdate();
	// }
	// get renderable() {
	// 	return !!(this.localDisplayStatus & 1);
	// }
	// set renderable(value) {
	// 	const valueNumber = value ? 1 : 0;
	// 	if ((this.localDisplayStatus & 1) === valueNumber) return;
	// 	this._updateFlags |= UPDATE_VISIBLE;
	// 	this.localDisplayStatus ^= 1;
	// 	if (this.parentRenderGroup) {
	// 		this.parentRenderGroup.structureDidChange = true;
	// 	}
	// 	this._onUpdate();
	// }
	// get isRenderable() {
	// 	return this.localDisplayStatus === 7 && this.groupAlpha > 0;
	// }
	// destroy(options = false) {
	// 	if (this.destroyed) return;
	// 	this.destroyed = true;
	// 	let oldChildren;
	// 	if (this.children.length) {
	// 		oldChildren = this.removeChildren(0, this.children.length);
	// 	}
	// 	this.removeFromParent();
	// 	this.parent = null;
	// 	this._maskEffect = null;
	// 	this._filterEffect = null;
	// 	this.effects = null;
	// 	this._position = null;
	// 	this._scale = null;
	// 	this._pivot = null;
	// 	this._skew = null;
	// 	this.emit("destroyed", this);
	// 	this.removeAllListeners();
	// 	const destroyChildren = typeof options === "boolean" ? options : options?.children;
	// 	if (destroyChildren && oldChildren) {
	// 		for (let i = 0; i < oldChildren.length; ++i) {
	// 			oldChildren[i].destroy(options);
	// 		}
	// 	}
	// 	this.renderGroup?.destroy();
	// 	this.renderGroup = null;
	// }
}

extensions.mixin(
	Container,
	// childrenHelperMixin,
	// getFastGlobalBoundsMixin,
	// toLocalGlobalMixin,
	// onRenderMixin,
	// measureMixin,
	// effectsMixin,
	// findMixin,
	sortMixin,
	// cullingMixin,
	// cacheAsTextureMixin,
	// getGlobalMixin,
	collectRenderablesMixin,
);

export { Container, UPDATE_BLEND, UPDATE_COLOR, UPDATE_TRANSFORM, UPDATE_VISIBLE };
