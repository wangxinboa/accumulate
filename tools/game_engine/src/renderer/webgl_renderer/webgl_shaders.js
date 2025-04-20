
const shaderVertexSrc =
	"attribute vec2 aVertexPosition;" +
	"attribute vec2 aTextureCoord;" +
	"attribute float aColor;" +
	"uniform mat4 uMVMatrix;" +
	"varying vec2 vTextureCoord;" +
	"varying float vColor;" +
	"void main(void) {" +
	"gl_Position = uMVMatrix * vec4(aVertexPosition, 1.0, 1.0);" +
	"vTextureCoord = aTextureCoord;" +
	"vColor = aColor;" +
	"}";

const shaderFragmentSrc =
	"precision mediump float;" +
	"varying vec2 vTextureCoord;" +
	"varying float vColor;" +
	"uniform sampler2D uSampler;" +
	"void main(void) {" +
	"gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));" +
	"gl_FragColor = gl_FragColor * vColor;" +
	"}";

let _shader_ = null;

export function compileVertexShader(gl) {
	_shader_ = gl.createShader(gl.VERTEX_SHADER);

	gl.shaderSource(_shader_, shaderVertexSrc);
	gl.compileShader(_shader_);

	if (!gl.getShaderParameter(_shader_, gl.COMPILE_STATUS)) {
		throw new Error('compileVertexShader error:' + gl.getShaderInfoLog(_shader_));
	}

	return _shader_;
}

export function compileFragmentShader(gl) {
	_shader_ = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(_shader_, shaderFragmentSrc);
	gl.compileShader(_shader_);

	if (!gl.getShaderParameter(_shader_, gl.COMPILE_STATUS)) {
		throw new Error('compileFragmentShader error:' + gl.getShaderInfoLog(_shader_));
	}

	return _shader_;
}