
export const shaderName = 'shadowMap'

BABYLON.Effect.ShadersStore[shaderName + "VertexShader"] = `
#ifdef GL_ES
precision mediump float;
#endif

// Attribute
attribute vec3 position;

// Uniform
uniform mat4 worldViewProjection;

void main(void)
{
	gl_Position = worldViewProjection * vec4(position, 1.0);
}
`


BABYLON.Effect.ShadersStore[shaderName + "PixelShader"] = `
#ifdef GL_ES
precision mediump float;
#endif

vec4 pack(float depth)
{
	const vec4 bitOffset = vec4(255. * 255. * 255., 255. * 255., 255., 1.);
	const vec4 bitMask = vec4(0., 1. / 255., 1. / 255., 1. / 255.);

	vec4 comp = fract(depth * bitOffset);
	comp -= comp.xxyz * bitMask;

	return comp;
}

// Thanks to http://devmaster.net/
vec2 packHalf(float depth)
{
	const vec2 bitOffset = vec2(1.0 / 255., 0.);
	vec2 color = vec2(depth, fract(depth * 255.));

	return color - (color.yy * bitOffset);
}


void main(void)
{
#ifdef VSM
	float moment1 = gl_FragCoord.z / gl_FragCoord.w;
	float moment2 = moment1 * moment1;
	gl_FragColor = vec4(packHalf(moment1), packHalf(moment2));
#else
	gl_FragColor = pack(gl_FragCoord.z / gl_FragCoord.w);
#endif
}


// void main(void)
// {
// 	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
// }
`