import { State } from "../../renderers/shared/state/State.js";

const batchAdaptor = {
	new() {
		this._tempState = State.for2d();
		this._didUploadHash = {};
		return this;
	},
	init() {},
	contextChange() {
		this._didUploadHash = {};
	},
	start(batchPipe, geometry, shader) {
		const renderer = batchPipe.renderer;
		const didUpload = this._didUploadHash[shader.uid];
		renderer.shader.bind(shader, didUpload);
		if (!didUpload) {
			this._didUploadHash[shader.uid] = true;
		}
		renderer.shader.updateUniformGroup(renderer.globalUniforms.uniformGroup);
		renderer.geometry.bind(geometry, shader.glProgram);
	},
	execute(batchPipe, batch) {
		const renderer = batchPipe.renderer;
		this._tempState.blendMode = batch.blendMode;
		renderer.state.set(this._tempState);
		const textures = batch.textures.textures;
		for (let i = 0; i < batch.textures.count; i++) {
			renderer.texture.bind(textures[i], i);
		}
		renderer.geometry.draw(batch.topology, batch.size, batch.start);
	},
};

export default batchAdaptor;
