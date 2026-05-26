import { getInitUrlSearchParam } from "../../javascript_utils/javascript_utils.js";

// 1. 获取 URL 中的 exampleUrl 参数
const exampleUrl = getInitUrlSearchParam("exampleUrl");

if (exampleUrl) {
	import(exampleUrl);
} else {
	throw new Error("exampleUrl 参数不存在");
}

// ?exampleUrl=../examples/src/scene/text/text_fill_gradient.js
// import("../examples/src/scene/text/text_fill_gradient.js");

// 对照源码
// ?exampleUrl=./render_node/sprite.js
// import("./render_node/sprite.js");
// ?exampleUrl=./render_node/sprite_two_texture/sprite_two_texture_example.js
// import("./render_node/sprite_two_texture/sprite_two_texture_example.js");
