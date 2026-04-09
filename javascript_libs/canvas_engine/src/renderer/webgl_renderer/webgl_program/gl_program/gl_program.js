import { BaseCleanUp, CustomMap } from "../../../../../../javascript_utils/javascript_utils.js";
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
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.GlUniformLocationsFormat} uniformLocationsFormat
	 * @param {CanvasEngineType.GlAttribLocationsFormat} attribLocationsFormat
	 * @returns {GlProgram}
	 */
	initLocations(gl, uniformLocationsFormat, attribLocationsFormat) {
		return this.initUniformLocations(gl, uniformLocationsFormat).initAttribLocations(gl, attribLocationsFormat);
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.GlUniformLocationsFormat} uniformLocationsFormat
	 * @returns {GlProgram}
	 */
	initUniformLocations(gl, uniformLocationsFormat) {
		for (let i = 0, len = uniformLocationsFormat.length; i < len; i++) {
			this.initUniformLocation(gl, uniformLocationsFormat[i]);
		}
		return this;
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.GlUniformLocationFormat} uniformLocationFormat
	 * @returns {GlProgram}
	 */
	initUniformLocation(gl, uniformLocationFormat) {
		this.uniformLocationsMap.set(
			uniformLocationFormat.name,
			new UniformLocation(uniformLocationFormat).initGlLocation(gl, this.program),
		);
		return this;
	}
	/**
	 * @param {string} UniformLocationName
	 */
	getUniformLocation(UniformLocationName) {
		return this.uniformLocationsMap.get(UniformLocationName).uniformLocation;
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.GlAttribLocationsFormat} attribLocationsFormat
	 * @returns {GlProgram}
	 */
	initAttribLocations(gl, attribLocationsFormat) {
		for (let i = 0, len = attribLocationsFormat.length; i < len; i++) {
			this.initAttribLocation(gl, attribLocationsFormat[i]);
		}
		return this;
	}
	/**
	 * @param {CanvasEngineType.WebGLContext} gl
	 * @param {CanvasEngineType.GlAttribLocationFormat} attribLocationFormat
	 * @returns {GlProgram}
	 */
	initAttribLocation(gl, attribLocationFormat) {
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
	 * @param {string} locationName
	 * @param {CanvasEngineType.GlUniformValue} locationValue
	 */
	uniform(gl, locationName, locationValue) {
		if (this.uniformLocationsMap.has(locationName)) {
			const glLocation = this.uniformLocationsMap.get(locationName);

			switch (glLocation.type) {
				case GlDataTypeEnum.sampler2D:
					break;
				case GlDataTypeEnum.mat4:
					break;
				default:
					throw new Error(`GlDataTypeEnum 中不存在对应的 gl 数据类型 ${glLocation.type}`);
			}
			// gl.uniform1ui
			this.uniformLocationsMap.get(locationName).uniformLocation;
		}
	}
}
