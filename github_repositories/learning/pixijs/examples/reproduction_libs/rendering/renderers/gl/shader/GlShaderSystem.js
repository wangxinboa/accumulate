import { getMaxTexturesPerBatch } from "../../../batcher/gl/utils/maxRecommendedTextures.js";
import { generateShaderSyncCode } from "./GenerateShaderSyncCode.js";
import { generateProgram } from "./program/generateProgram.js";

const defaultSyncData = {
	textureCount: 0,
	blockIndex: 0,
};
const shaderSystem = {
	_activeProgram: null,
	_programDataHash: {},
	_shaderSyncFunctions: {},

	new(renderer) {
		this._renderer = renderer;
	},
	contextChange(gl) {
		this._gl = gl;
		this._programDataHash = {};
		this._shaderSyncFunctions = {};
		this._activeProgram = null;
		this.maxTextures = getMaxTexturesPerBatch();
	},
	bind(shader, skipSync) {
		this._setProgram(shader.glProgram);
		if (skipSync) return;
		defaultSyncData.textureCount = 0;
		defaultSyncData.blockIndex = 0;
		let syncFunction = this._shaderSyncFunctions[shader.glProgram._key];
		if (!syncFunction) {
			syncFunction = this._shaderSyncFunctions[shader.glProgram._key] = this._generateShaderSync(shader, this);
		}
		this._renderer.buffer.nextBindBase(!!shader.glProgram.transformFeedbackVaryings);
		syncFunction(this._renderer, shader, defaultSyncData);
	},
	updateUniformGroup(uniformGroup) {
		this._renderer.uniformGroup.updateUniformGroup(uniformGroup, this._activeProgram, defaultSyncData);
	},

	_setProgram(program) {
		if (this._activeProgram === program) return;
		this._activeProgram = program;
		const programData = this._getProgramData(program);
		this._gl.useProgram(programData.program);
	},
	_getProgramData(program) {
		return this._programDataHash[program._key] || this._createProgramData(program);
	},
	_createProgramData(program) {
		const key = program._key;
		this._programDataHash[key] = generateProgram(this._gl, program);
		return this._programDataHash[key];
	},
	_generateShaderSync(shader, shaderSystem) {
		return generateShaderSyncCode(shader, shaderSystem);
	},
};

export default shaderSystem;
