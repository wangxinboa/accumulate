import { BufferUsage } from "../../shared/buffer/const.js";
import { BUFFER_TYPE } from "./const.js";
import { GlBuffer } from "./GlBuffer.js";

const bufferSystem = {
	new(renderer) {
		this._renderer = renderer;
		return this;
	},
	contextChange(gl) {
		this._gl = gl;
		this._gpuBuffers = {};
		this._maxBindings = gl.MAX_UNIFORM_BUFFER_BINDINGS ? gl.getParameter(gl.MAX_UNIFORM_BUFFER_BINDINGS) : 0;
	},
	getGlBuffer(buffer) {
		return this._gpuBuffers[buffer.uid] || this.createGLBuffer(buffer);
	},
	bind(buffer) {
		const { _gl: gl } = this;
		const glBuffer = this.getGlBuffer(buffer);
		gl.bindBuffer(glBuffer.type, glBuffer.buffer);
	},
	nextBindBase(hasTransformFeedback) {
		this._bindCallId++;
		this._minBaseLocation = 0;
		if (hasTransformFeedback) {
			this._boundBufferBases[0] = null;
			this._minBaseLocation = 1;
			if (this._nextBindBaseIndex < 1) {
				this._nextBindBaseIndex = 1;
			}
		}
	},
	updateBuffer(buffer) {
		const { _gl: gl } = this;
		const glBuffer = this.getGlBuffer(buffer);
		if (buffer._updateID === glBuffer.updateID) {
			return glBuffer;
		}
		glBuffer.updateID = buffer._updateID;
		gl.bindBuffer(glBuffer.type, glBuffer.buffer);
		const data = buffer.data;
		const drawType = buffer.descriptor.usage & BufferUsage.STATIC ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW;
		if (data) {
			if (glBuffer.byteLength >= data.byteLength) {
				gl.bufferSubData(glBuffer.type, 0, data, 0, buffer._updateSize / data.BYTES_PER_ELEMENT);
			} else {
				glBuffer.byteLength = data.byteLength;
				gl.bufferData(glBuffer.type, data, drawType);
			}
		} else {
			glBuffer.byteLength = buffer.descriptor.size;
			gl.bufferData(glBuffer.type, glBuffer.byteLength, drawType);
		}
		return glBuffer;
	},
	onBufferDestroy(buffer, contextLost) {
		const glBuffer = this._gpuBuffers[buffer.uid];
		const gl = this._gl;
		if (!contextLost) {
			gl.deleteBuffer(glBuffer.buffer);
		}
		this._gpuBuffers[buffer.uid] = null;
	},
	createGLBuffer(buffer) {
		const { _gl: gl } = this;
		let type = BUFFER_TYPE.ARRAY_BUFFER;
		if (buffer.descriptor.usage & BufferUsage.INDEX) {
			type = BUFFER_TYPE.ELEMENT_ARRAY_BUFFER;
		} else if (buffer.descriptor.usage & BufferUsage.UNIFORM) {
			type = BUFFER_TYPE.UNIFORM_BUFFER;
		}
		const glBuffer = new GlBuffer(gl.createBuffer(), type);
		this._gpuBuffers[buffer.uid] = glBuffer;
		buffer.on("destroy", this.onBufferDestroy, this);
		return glBuffer;
	},
};

export default bufferSystem;
