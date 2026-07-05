import {
	uCameraProjectionName,
	uCameraViewName,
	uRenderNodeModelName,
} from "../../../../renderers/webgl_renderer/shaders/global_uniform_names.js";
import { GlDataTypeEnum } from "../../../../renderers/webgl_renderer/webgl_program/gl_program/gl_data_type.js";

export const uColorName = "u_color";
export const uRadiusName = "u_radius";

export const aPositionName = "a_position";

const vertexSource =
	"attribute vec2 a_position;" +
	"uniform mat3 u_projection;" +
	"uniform mat3 u_view;" +
	"uniform mat3 u_model;" +
	"varying vec2 v_position;" +
	"void main() {" +
	"v_position = a_position;" +
	"vec3 pos = u_projection * u_view * u_model * vec3(a_position, 1.0);" +
	"gl_Position = vec4(pos.xy, 0.0, 1.0);" +
	"}";

const fragmentSource =
	"precision mediump float;" +
	"uniform vec4 u_color;" +
	"uniform float u_radius;" +
	"varying vec2 v_position;" +
	"void main() {" +
	"float dist = distance(v_position, vec2(u_radius, u_radius));" +
	"float t = 1.0 - clamp(dist - u_radius + 1.0, 0.0, 1.0);" +
	"gl_FragColor = vec4(u_color.rgb, u_color.a * t);" +
	"}";

export const circleGlProgramFormat = {
	vertexSource,
	fragmentSource,
	uniformLocationsFormat: [
		{ type: GlDataTypeEnum.mat3, name: uCameraProjectionName },
		{ type: GlDataTypeEnum.mat3, name: uCameraViewName },
		{ type: GlDataTypeEnum.mat3, name: uRenderNodeModelName },
		{ type: GlDataTypeEnum.color, name: uColorName },
		{ type: GlDataTypeEnum.float, name: uRadiusName },
	],
	attribLocationsFormat: [{ type: GlDataTypeEnum.vec2, name: aPositionName }],
};
