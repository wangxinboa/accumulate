import { generateUniformsSync } from "./utils/generateUniformsSync.js";

const glUniformGroupSystem = {
	new(renderer) {
		/** Cache to holds the generated functions. Stored against UniformObjects unique signature. */
		this._cache = {};
		this._uniformGroupSyncHash = {};
		this._renderer = renderer;
		this.gl = null;
		this._cache = {};
	},
	contextChange(gl) {
		this.gl = gl;
	},
	updateUniformGroup(group, program, syncData) {
		const programData = this._renderer.shader._getProgramData(program);
		if (!group.isStatic || group._dirtyId !== programData.uniformDirtyGroups[group.uid]) {
			programData.uniformDirtyGroups[group.uid] = group._dirtyId;
			const syncFunc = this._getUniformSyncFunction(group, program);
			syncFunc(programData.uniformData, group.uniforms, this._renderer, syncData);
		}
	},
	_getUniformSyncFunction(group, program) {
		return (
			this._uniformGroupSyncHash[group._signature]?.[program._key] || this._createUniformSyncFunction(group, program)
		);
	},
	_createUniformSyncFunction(group, program) {
		const uniformGroupSyncHash =
			this._uniformGroupSyncHash[group._signature] || (this._uniformGroupSyncHash[group._signature] = {});
		const id = this._getSignature(group, program._uniformData, "u");
		if (!this._cache[id]) {
			this._cache[id] = this._generateUniformsSync(group, program._uniformData);
		}
		uniformGroupSyncHash[program._key] = this._cache[id];
		return uniformGroupSyncHash[program._key];
	},
	_generateUniformsSync(group, uniformData) {
		return generateUniformsSync(group, uniformData);
	},
	_getSignature(group, uniformData, preFix) {
		const uniforms = group.uniforms;
		const strings = [`${preFix}-`];
		for (const i in uniforms) {
			strings.push(i);
			if (uniformData[i]) {
				strings.push(uniformData[i].type);
			}
		}
		return strings.join("-");
	},
};

export default glUniformGroupSystem;
