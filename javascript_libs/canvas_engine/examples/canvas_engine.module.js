import { getInitUrlSearchParam } from "../../javascript_utils/javascript_utils.js";

const exampleRelativePath = [
	"./render_node/sprite.js",
	"./render_node/sprite_two_texture/sprite_two_texture_example.js",
	"./texture/text_texture.js",
];

// 1. 获取 URL 中的 exampleId 参数
const exampleId = getInitUrlSearchParam("exampleId");

if (exampleId) {
	import(exampleRelativePath[Number(exampleId)]);
} else {
	throw new Error("exampleId 参数不存在");
}
