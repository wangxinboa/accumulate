import Color from '../../math/color.js';
import ImageSwitcher from '../../objects/2d/image/image_switcher.js';
import ImageObject from '../../objects/2d/image/image.js';
import WebGLBatch from './webgl_batch.js';
import { compileVertexShader, compileFragmentShader } from './webgl_shaders.js';


export default class WebGLRenderer {
	constructor(el, option) {
		this.el = el;
		this.transparent = option.transparent !== void 0 ? option.transparent : true;
		try {
			this.gl = this.el.getContext("experimental-webgl", {
				alpha: this.transparent,
				antialias: true,
				premultipliedAlpha: true
			});
		} catch (e) {
			throw new Error(" This browser does not support webGL. Try using the canvas renderer");
		}

		this.retinaScaling = option.devicePixelRatio || window.devicePixelRatio;
		this.backgroundColor = new Color(option.backgroundColor, option.backgroundAlpha !== void 0 ? option.backgroundAlpha : 1);

		this.initShaders();
		this.gl.disable(this.gl.DEPTH_TEST);
		this.gl.enable(this.gl.BLEND);
		this.gl.colorMask(true, true, true, this.transparent);

		this.projectionMatrix = mat4.create();

		this.contextLost = false;
	}

	initShaders() {
		this.shaderProgram = this.gl.createProgram();

		this.gl.attachShader(this.shaderProgram, compileVertexShader(this.gl));
		this.gl.attachShader(this.shaderProgram, compileFragmentShader(this.gl));
		this.gl.linkProgram(this.shaderProgram);

		if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
			throw new Error("Could not initialise shaders");
		}

		this.gl.useProgram(this.shaderProgram);

		this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
		this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

		this.shaderProgram.textureCoordAttribute = this.gl.getAttribLocation(this.shaderProgram, "aTextureCoord");
		this.gl.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute);

		this.shaderProgram.colorAttribute = this.gl.getAttribLocation(this.shaderProgram, "aColor");
		this.gl.enableVertexAttribArray(this.shaderProgram.colorAttribute);


		this.shaderProgram.mvMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
		this.shaderProgram.samplerUniform = this.gl.getUniformLocation(this.shaderProgram, "uSampler");
	}

	resize(width, height, retinaScaling) {
		this.gl.viewport(0, 0, width * retinaScaling, height * retinaScaling);

		mat4.identity(this.projectionMatrix);
		mat4.scale(this.projectionMatrix, [retinaScaling / width, -retinaScaling / height, 1]);
		mat4.translate(this.projectionMatrix, [-width / retinaScaling, -height / retinaScaling, 0]);
	}

	render(scene, time) {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		this.gl.clearColor(this.backgroundColor.r, this.backgroundColor.g, this.backgroundColor.b, this.backgroundColor.a);

		this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
		this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.projectionMatrix);

		scene.clearVisibleObjects();
		this._renderObject(scene, scene.root, time);
	}

	_renderObject(scene, obejct, time) {
		let child = null;
		for (let i = 0, len = obejct.children.length; i < len; i++) {
			child = obejct.children[i];
			if (child.visible) {
				child.update(time);
				child.updateMatrix();

				this._drawPrimitive(child);
				scene.addVisibleObject(child);
				this._renderObject(scene, child, time);
			}
		}
		child = null;
	}

	_drawPrimitive(object) {
		if (
			object instanceof ImageObject ||
			object instanceof ImageSwitcher
		) {
			this.updateTexture(object.imageTask);
			if (!object._batch) {
				object._batch = new WebGLBatch(this.gl);
				object._batch.init(object);
			}
			object._batch.render(this.shaderProgram);
		}
	}

	updateTexture(texture) {
		if (!texture._glTexture && texture.isLoaded) {
			texture._glTexture = this.gl.createTexture();

			this.gl.bindTexture(this.gl.TEXTURE_2D, texture._glTexture);
			this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
			this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, texture.image);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

			//	this.gl.generateMipmap(this.gl.TEXTURE_2D);
			this.gl.bindTexture(this.gl.TEXTURE_2D, null);

			this.refreshBatchs = true;
		}
	}

	destroy() {

	}
}