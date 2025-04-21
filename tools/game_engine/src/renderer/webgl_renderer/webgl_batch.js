import { BlendModes } from './gl_const.js';

export default class WebGLBatch {
	constructor(gl) {
		this.gl = gl;

		this.size = 0;

		this.vertexBuffer = gl.createBuffer();
		this.indexBuffer = gl.createBuffer();
		this.uvBuffer = gl.createBuffer();
		this.colorBuffer = gl.createBuffer();
		this.blendMode = BlendModes.NORMAL;
		this.dynamicSize = 1;
	}

	init(sprite) {
		this.sprite = sprite;
		this.dirty = true;
		this.blendMode = sprite.blendMode || BlendModes.NORMAL;
		this.size = 1;

		this.growBatch();
	}

	growBatch() {
		this.dynamicSize = this.size;

		// grow verts
		this.verticies = new Float32Array(this.dynamicSize * 8);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.verticies, this.gl.DYNAMIC_DRAW);

		this.uvs = new Float32Array(this.dynamicSize * 8);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.uvs, this.gl.DYNAMIC_DRAW);

		this.dirtyUVS = true;

		this.colors = new Float32Array(this.dynamicSize * 4);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, this.colors, this.gl.DYNAMIC_DRAW);

		this.dirtyColors = true;

		this.indices = new Uint16Array(this.dynamicSize * 6);
		const length = this.dynamicSize;

		for (var i = 0; i < length; i++) {
			const index2 = i * 6;
			const index3 = i * 4;
			this.indices[index2 + 0] = index3 + 0;
			this.indices[index2 + 1] = index3 + 1;
			this.indices[index2 + 2] = index3 + 2;
			this.indices[index2 + 3] = index3 + 0;
			this.indices[index2 + 4] = index3 + 2;
			this.indices[index2 + 5] = index3 + 3;
		};

		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.STATIC_DRAW);
	}

	update() {
		var worldTransform, width, height, aX, aY, w0, w1, h0, h1, index;

		var a, b, c, d, tx, ty;

		var indexRun = 0;

		var displayObject = this.sprite;

		width = displayObject.width;
		height = displayObject.height;

		aX = displayObject.anchorX;
		aY = displayObject.anchorY;
		w0 = width * (1 - aX);
		w1 = width * -aX;

		// console.info('aX:', aX);
		// console.info('aY:', aY);

		h0 = height * (1 - aY);
		h1 = height * -aY;

		index = indexRun * 8;

		worldTransform = displayObject.matrixWorld.elements;

		a = worldTransform[0];
		b = worldTransform[1];
		c = worldTransform[3];
		d = worldTransform[4];
		tx = worldTransform[6];
		ty = worldTransform[7];

		this.verticies[index + 0] = a * w1 + c * h1 + tx;
		this.verticies[index + 1] = d * h1 + b * w1 + ty;

		this.verticies[index + 2] = a * w0 + c * h1 + tx;
		this.verticies[index + 3] = d * h1 + b * w0 + ty;

		this.verticies[index + 4] = a * w0 + c * h0 + tx;
		this.verticies[index + 5] = d * h0 + b * w0 + ty;

		this.verticies[index + 6] = a * w1 + c * h0 + tx;
		this.verticies[index + 7] = d * h0 + b * w1 + ty;

		// console.info('this.verticies:', this.verticies);
		// this.verticies[0] = 0;
		// this.verticies[1] = 150;
		// this.verticies[2] = 26;
		// this.verticies[3] = 150;
		// this.verticies[4] = 26;
		// this.verticies[5] = 187;
		// this.verticies[6] = 0;
		// this.verticies[7] = 187;

		// this.dirtyUVS = true;

		var texture = displayObject.imageTask;

		var frame = texture;
		var tw = texture.width;
		var th = texture.height;

		this.uvs[index + 0] = frame.x / tw;
		this.uvs[index + 1] = frame.y / th;

		this.uvs[index + 2] = (frame.x + frame.width) / tw;
		this.uvs[index + 3] = frame.y / th;

		this.uvs[index + 4] = (frame.x + frame.width) / tw;
		this.uvs[index + 5] = (frame.y + frame.height) / th;

		this.uvs[index + 6] = frame.x / tw;
		this.uvs[index + 7] = (frame.y + frame.height) / th;

		// console.info('this.uvs:', this.uvs);
		this.uvs[0] = 0;
		this.uvs[1] = 0;
		this.uvs[2] = 1;
		this.uvs[3] = 0;
		this.uvs[4] = 1;
		this.uvs[5] = 1;
		this.uvs[6] = 0;
		this.uvs[7] = 1;
		// console.info('this.uvs:', this.uvs);

		// displayObject.updateFrame = false;
		// }

		// if (displayObject.cacheAlpha != displayObject.worldAlpha) {
		var colorIndex = indexRun * 4;
		this.colors[colorIndex] =
			this.colors[colorIndex + 1] =
			this.colors[colorIndex + 2] =
			this.colors[colorIndex + 3] = displayObject.opacity;;
		this.dirtyColors = true;
		// }
	}

	render(shaderProgram) {
		if (this.size == 0) {
			return;
		}

		this.update();
		var gl = this.gl;

		//TODO optimize this!
		if (this.blendMode == BlendModes.NORMAL) {
			gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		}
		else {
			gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_COLOR);
		}

		// update the verts..
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		// ok..
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.verticies);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);

		// update the uvs
		gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);

		if (this.dirtyUVS) {
			this.dirtyUVS = false;
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.uvs);
		}

		gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.sprite.imageTask._glTexture);

		// update color!
		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);

		// if (this.dirtyColors) {
		// 	this.dirtyColors = false;
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.colors);
		// }

		gl.vertexAttribPointer(shaderProgram.colorAttribute, 1, gl.FLOAT, false, 0, 0);

		// dont need to upload!
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

		// DRAW THAT this!
		gl.drawElements(gl.TRIANGLES, this.size * 6, gl.UNSIGNED_SHORT, 0);
	}
}