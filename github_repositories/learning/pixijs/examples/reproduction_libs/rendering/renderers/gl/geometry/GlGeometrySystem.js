import { getAttributeInfoFromFormat } from "../../shared/geometry/utils/getAttributeInfoFromFormat.js";
import { ensureAttributes } from "../shader/program/ensureAttributes.js";
import { getGlTypeFromFormat } from "./utils/getGlTypeFromFormat.js";

const topologyToGlMap = {
	"point-list": 0,
	"line-list": 1,
	"line-strip": 3,
	"triangle-list": 4,
	"triangle-strip": 5,
};

const geometrySystem = {
	new(renderer) {
		this._geometryVaoHash = {};
		this._renderer = renderer;
	},
	contextChange(gl) {
		this.gl = gl;
		if (!this._renderer.context.supports.vertexArrayObject) {
			throw new Error("[PixiJS] Vertex Array Objects are not supported on this device");
		}
		const nativeVaoExtension = this._renderer.context.extensions.vertexArrayObject;
		if (nativeVaoExtension) {
			gl.createVertexArray = () => nativeVaoExtension.createVertexArrayOES();
			gl.bindVertexArray = (vao) => nativeVaoExtension.bindVertexArrayOES(vao);
			gl.deleteVertexArray = (vao) => nativeVaoExtension.deleteVertexArrayOES(vao);
		}
		const nativeInstancedExtension = this._renderer.context.extensions.vertexAttribDivisorANGLE;
		if (nativeInstancedExtension) {
			gl.drawArraysInstanced = (a, b, c, d) => {
				nativeInstancedExtension.drawArraysInstancedANGLE(a, b, c, d);
			};
			gl.drawElementsInstanced = (a, b, c, d, e) => {
				nativeInstancedExtension.drawElementsInstancedANGLE(a, b, c, d, e);
			};
			gl.vertexAttribDivisor = (a, b) => nativeInstancedExtension.vertexAttribDivisorANGLE(a, b);
		}
		this._activeGeometry = null;
		this._activeVao = null;
		this._geometryVaoHash = {};
	},
	bind(geometry, program) {
		const gl = this.gl;
		this._activeGeometry = geometry;
		const vao = this.getVao(geometry, program);
		if (this._activeVao !== vao) {
			this._activeVao = vao;
			gl.bindVertexArray(vao);
		}
		this.updateBuffers();
	},
	updateBuffers() {
		const geometry = this._activeGeometry;
		const bufferSystem = this._renderer.buffer;
		for (let i = 0; i < geometry.buffers.length; i++) {
			const buffer = geometry.buffers[i];
			bufferSystem.updateBuffer(buffer);
		}
	},
	checkCompatibility(geometry, program) {
		const geometryAttributes = geometry.attributes;
		const shaderAttributes = program._attributeData;
		for (const j in shaderAttributes) {
			if (!geometryAttributes[j]) {
				throw new Error(`shader and geometry incompatible, geometry missing the "${j}" attribute`);
			}
		}
	},
	getSignature(geometry, program) {
		const attribs = geometry.attributes;
		const shaderAttributes = program._attributeData;
		const strings = ["g", geometry.uid];
		for (const i in attribs) {
			if (shaderAttributes[i]) {
				strings.push(i, shaderAttributes[i].location);
			}
		}
		return strings.join("-");
	},
	getVao(geometry, program) {
		return this._geometryVaoHash[geometry.uid]?.[program._key] || this.initGeometryVao(geometry, program);
	},
	initGeometryVao(geometry, program, _incRefCount = true) {
		const gl = this._renderer.gl;
		const bufferSystem = this._renderer.buffer;
		this._renderer.shader._getProgramData(program);
		this.checkCompatibility(geometry, program);
		const signature = this.getSignature(geometry, program);
		if (!this._geometryVaoHash[geometry.uid]) {
			this._geometryVaoHash[geometry.uid] = {};
			// geometry.on("destroy", this.onGeometryDestroy, this);
		}
		const vaoObjectHash = this._geometryVaoHash[geometry.uid];
		let vao = vaoObjectHash[signature];
		if (vao) {
			vaoObjectHash[program._key] = vao;
			return vao;
		}
		ensureAttributes(geometry, program._attributeData);
		const buffers = geometry.buffers;
		vao = gl.createVertexArray();
		gl.bindVertexArray(vao);
		for (let i = 0; i < buffers.length; i++) {
			const buffer = buffers[i];
			bufferSystem.bind(buffer);
		}
		this.activateVao(geometry, program);
		vaoObjectHash[program._key] = vao;
		vaoObjectHash[signature] = vao;
		gl.bindVertexArray(null);
		return vao;
	},
	activateVao(geometry, program) {
		const gl = this._renderer.gl;
		const bufferSystem = this._renderer.buffer;
		const attributes = geometry.attributes;
		if (geometry.indexBuffer) {
			bufferSystem.bind(geometry.indexBuffer);
		}
		let lastBuffer = null;
		for (const j in attributes) {
			const attribute = attributes[j];
			const buffer = attribute.buffer;
			const glBuffer = bufferSystem.getGlBuffer(buffer);
			const programAttrib = program._attributeData[j];
			if (programAttrib) {
				if (lastBuffer !== glBuffer) {
					bufferSystem.bind(buffer);
					lastBuffer = glBuffer;
				}
				const location = programAttrib.location;
				gl.enableVertexAttribArray(location);
				const attributeInfo = getAttributeInfoFromFormat(attribute.format);
				const type = getGlTypeFromFormat(attribute.format);
				if (programAttrib.format?.substring(1, 4) === "int") {
					gl.vertexAttribIPointer(location, attributeInfo.size, type, attribute.stride, attribute.offset);
				} else {
					gl.vertexAttribPointer(
						location,
						attributeInfo.size,
						type,
						attributeInfo.normalised,
						attribute.stride,
						attribute.offset,
					);
				}
				if (attribute.instance) {
					if (this.hasInstance) {
						const divisor = attribute.divisor ?? 1;
						gl.vertexAttribDivisor(location, divisor);
					} else {
						throw new Error("geometry error, GPU Instancing is not supported on this device");
					}
				}
			}
		}
	},
	draw(topology, size, start, instanceCount) {
		const { gl } = this._renderer;
		const geometry = this._activeGeometry;
		const glTopology = topologyToGlMap[topology || geometry.topology];
		instanceCount ?? (instanceCount = geometry.instanceCount);
		if (geometry.indexBuffer) {
			const byteSize = geometry.indexBuffer.data.BYTES_PER_ELEMENT;
			const glType = byteSize === 2 ? gl.UNSIGNED_SHORT : gl.UNSIGNED_INT;
			if (instanceCount > 1) {
				gl.drawElementsInstanced(
					glTopology,
					size || geometry.indexBuffer.data.length,
					glType,
					(start || 0) * byteSize,
					instanceCount,
				);
			} else {
				gl.drawElements(glTopology, size || geometry.indexBuffer.data.length, glType, (start || 0) * byteSize);
			}
		} else if (instanceCount > 1) {
			gl.drawArraysInstanced(glTopology, start || 0, size || geometry.getSize(), instanceCount);
		} else {
			gl.drawArrays(glTopology, start || 0, size || geometry.getSize());
		}
		return this;
	},
};

export default geometrySystem;
