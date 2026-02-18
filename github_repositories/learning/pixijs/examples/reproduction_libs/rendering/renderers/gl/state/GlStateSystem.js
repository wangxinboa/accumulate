import { State } from "../../shared/state/State.js";
import { mapWebGLBlendModesToPixi } from "./mapWebGLBlendModesToPixi.js";

const BLEND = 0;
const OFFSET = 1;
const CULLING = 2;
const DEPTH_TEST = 3;
const WINDING = 4;
const DEPTH_MASK = 5;

const stateSystem = {
	stateId: 0,
	polygonOffset: 0,
	blendMode: "none",
	_blendEq: false,
	map: [],
	checks: [],
	defaultState: State.for2d(),

	contextChange(gl) {
		this.gl = gl;
		this.blendModesMap = mapWebGLBlendModesToPixi(gl);
		this.resetState();
	},
	set(state) {
		state || (state = this.defaultState);
		if (this.stateId !== state.data) {
			let diff = this.stateId ^ state.data;
			let i = 0;
			while (diff) {
				if (diff & 1) {
					this.map[i].call(this, !!(state.data & (1 << i)));
				}
				diff >>= 1;
				i++;
			}
			this.stateId = state.data;
		}
		for (let i = 0; i < this.checks.length; i++) {
			this.checks[i](this, state);
		}
	},
	forceState(state) {
		state || (state = this.defaultState);
		for (let i = 0; i < this.map.length; i++) {
			this.map[i].call(this, !!(state.data & (1 << i)));
		}
		for (let i = 0; i < this.checks.length; i++) {
			this.checks[i](this, state);
		}
		this.stateId = state.data;
	},
	setBlend(value) {
		this._updateCheck(stateSystem._checkBlendMode, value);
		this.gl[value ? "enable" : "disable"](this.gl.BLEND);
	},
	setOffset(value) {
		this._updateCheck(stateSystem._checkPolygonOffset, value);
		this.gl[value ? "enable" : "disable"](this.gl.POLYGON_OFFSET_FILL);
	},
	setDepthTest(value) {
		this.gl[value ? "enable" : "disable"](this.gl.DEPTH_TEST);
	},
	setDepthMask(value) {
		this.gl.depthMask(value);
	},
	setCullFace(value) {
		this._cullFace = value;
		this.gl[value ? "enable" : "disable"](this.gl.CULL_FACE);
		if (this._cullFace && this._frontFaceDirty) {
			this.setFrontFace(this._frontFace);
		}
	},
	setFrontFace(value) {
		this._frontFace = value;
		this._frontFaceDirty = false;
		const faceMode = this._invertFrontFace ? !value : value;
		if (this._glFrontFace !== faceMode) {
			this._glFrontFace = faceMode;
			this.gl.frontFace(this.gl[faceMode ? "CW" : "CCW"]);
		}
	},
	setBlendMode(value) {
		if (!this.blendModesMap[value]) {
			value = "normal";
		}
		if (value === this.blendMode) {
			return;
		}
		this.blendMode = value;
		const mode = this.blendModesMap[value];
		const gl = this.gl;
		if (mode.length === 2) {
			gl.blendFunc(mode[0], mode[1]);
		} else {
			gl.blendFuncSeparate(mode[0], mode[1], mode[2], mode[3]);
		}
		if (mode.length === 6) {
			this._blendEq = true;
			gl.blendEquationSeparate(mode[4], mode[5]);
		} else if (this._blendEq) {
			this._blendEq = false;
			gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
		}
	},
	resetState() {
		this._glFrontFace = false;
		this._frontFace = false;
		this._cullFace = false;
		this._frontFaceDirty = false;
		this._invertFrontFace = false;
		this.gl.frontFace(this.gl.CCW);
		this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);
		this.forceState(this.defaultState);
		this._blendEq = true;
		this.blendMode = "";
		this.setBlendMode("normal");
	},
	_updateCheck(func, value) {
		const index = this.checks.indexOf(func);
		if (value && index === -1) {
			this.checks.push(func);
		} else if (!value && index !== -1) {
			this.checks.splice(index, 1);
		}
	},
};

stateSystem.map[BLEND] = stateSystem.setBlend;
stateSystem.map[OFFSET] = stateSystem.setOffset;
stateSystem.map[CULLING] = stateSystem.setCullFace;
stateSystem.map[DEPTH_TEST] = stateSystem.setDepthTest;
stateSystem.map[WINDING] = stateSystem.setFrontFace;
stateSystem.map[DEPTH_MASK] = stateSystem.setDepthMask;

export default stateSystem;
