import { BaseCleanUp, CustomMap } from "../../../../../../javascript_utils/javascript_utils.js";
import { GlTextureImageUnitsEnum } from "../../webgl_texture/gl_texture_type.js";
import { GlDataTypeEnum } from "./gl_data_type.js";
import { AttribLocation } from "./gl_location/attrib_location.js";
import { UniformLocation } from "./gl_location/uniform_location.js";

export class GlProgram extends BaseCleanUp {
	/** @type {CanvasEngineType.GlProgramFormat["vertexSource"]} */
	vertexSource;
	/** @type {CanvasEngineType.GlProgramFormat["fragmentSource"]} */
	fragmentSource;
	/** @type {WebGLProgram} */
	program;
	/** @type {CustomMap<UniformLocation>} */
	uniformLocationsMap;
	/** @type {CustomMap<AttribLocation>} */
	attribLocationsMap;

	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.GlProgramFormat} glProgramFormat
	 */
	constructor(gl, glProgramFormat) {
		super();

		this.vertexSource = glProgramFormat.vertexSource;
		this.fragmentSource = glProgramFormat.fragmentSource;

		this.uniformLocationsMap = new CustomMap().disableOverwrite();
		this.attribLocationsMap = new CustomMap().disableOverwrite();

		this.program = this._initProgram(gl);

		this.uniformTexturesCount = 0;

		this._addUniformLocations(gl, glProgramFormat.uniformLocationsFormat);
		this._addAttribLocations(gl, glProgramFormat.attribLocationsFormat);
	}
	/**
	 * @private
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @returns {WebGLProgram}
	 */
	_initProgram(gl) {
		const vertexShader = gl.createShader(gl.VERTEX_SHADER);
		const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		if (vertexShader && fragmentShader) {
			gl.shaderSource(vertexShader, this.vertexSource);
			gl.compileShader(vertexShader);

			gl.shaderSource(fragmentShader, this.fragmentSource);
			gl.compileShader(fragmentShader);

			const program = gl.createProgram();
			gl.attachShader(program, vertexShader);
			gl.attachShader(program, fragmentShader);
			gl.linkProgram(program);

			if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
				throw new Error(`着色器程序链接失败: ${gl.getProgramInfoLog(program)}`);
			}

			gl.deleteShader(vertexShader);
			gl.deleteShader(fragmentShader);

			return program;
		} else {
			throw new Error("_initProgram 时 vertexShader 或 fragmentShader 不存在");
		}
	}
	/**
	 * @private
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.GlUniformLocationsFormat} uniformLocationsFormat
	 * @returns {GlProgram}
	 */
	_addUniformLocations(gl, uniformLocationsFormat) {
		for (let i = 0, len = uniformLocationsFormat.length; i < len; i++) {
			this._addUniformLocation(gl, uniformLocationsFormat[i]);
		}
		return this;
	}
	/**
	 * @private
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.GlUniformLocationFormat} uniformLocationFormat
	 * @returns {GlProgram}
	 */
	_addUniformLocation(gl, uniformLocationFormat) {
		this.uniformLocationsMap.set(
			uniformLocationFormat.name,
			new UniformLocation(uniformLocationFormat).initGlLocation(gl, this.program),
		);
		return this;
	}
	/**
	 * @param {string} uniformLocationName
	 */
	getUniformLocation(uniformLocationName) {
		return this.uniformLocationsMap.get(uniformLocationName).uniformLocation;
	}
	/**
	 * @private
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.GlAttribLocationsFormat} attribLocationsFormat
	 * @returns {GlProgram}
	 */
	_addAttribLocations(gl, attribLocationsFormat) {
		for (let i = 0, len = attribLocationsFormat.length; i < len; i++) {
			this._addAttribLocation(gl, attribLocationsFormat[i]);
		}
		return this;
	}
	/**
	 * @private
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.GlAttribLocationFormat} attribLocationFormat
	 * @returns {GlProgram}
	 */
	_addAttribLocation(gl, attribLocationFormat) {
		this.attribLocationsMap.set(
			attribLocationFormat.name,
			new AttribLocation(attribLocationFormat).initGlLocation(gl, this.program),
		);
		return this;
	}
	/**
	 * @param {string} attribLocationName
	 * @returns {number}
	 */
	getAttribLocation(attribLocationName) {
		return this.attribLocationsMap.get(attribLocationName).attribLocation;
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @returns {GlProgram}
	 */
	use(gl) {
		gl.useProgram(this.program);
		return this;
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @returns {GlProgram}
	 */
	delete(gl) {
		gl.deleteProgram(this.program);
		return this;
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @returns {GlProgram}
	 */
	reset(gl) {
		this.program = this._initProgram(gl);

		for (let i = 0, len = this.uniformLocationsMap.array.length; i < len; i++) {
			this.uniformLocationsMap.array[i].initGlLocation(gl, this.program);
		}
		for (let i = 0, len = this.attribLocationsMap.array.length; i < len; i++) {
			this.attribLocationsMap.array[i].initGlLocation(gl, this.program);
		}

		return this;
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {string} locationName
	 * @param {CanvasEngineType.GlUniformValue} locationValue
	 */
	uniform(gl, locationName, locationValue) {
		if (this.uniformLocationsMap.has(locationName)) {
			const glLocation = this.uniformLocationsMap.get(locationName);

			switch (glLocation.type) {
				case GlDataTypeEnum.sampler2D:
					gl.activeTexture(gl[GlTextureImageUnitsEnum[this.uniformTexturesCount]]);
					gl.bindTexture(gl.TEXTURE_2D, /** @type {CanvasEngineType.GlTexture} */ (locationValue).texture);
					gl.uniform1i(glLocation.uniformLocation, this.uniformTexturesCount);

					this.uniformTexturesCount++;

					break;
				case GlDataTypeEnum.mat4:
					gl.uniformMatrix4fv(
						glLocation.uniformLocation,
						false,
						/** @type {CanvasEngineType.Matrix4} */ (locationValue).elements,
					);
					break;
				default:
					throw new Error(`GlDataTypeEnum 中不存在对应的 gl 数据类型 ${glLocation.type}`);
			}
		}
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {number} mode
	 * @param {number} first
	 * @param {number} count
	 */
	drawArrays(gl, mode, first, count) {
		gl.drawArrays(mode, first, count);
		this.uniformTexturesCount = 0;
	}
}
