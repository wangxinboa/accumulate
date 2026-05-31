import { getInitUrlSearchParam } from "../../../../javascript_libs/javascript_utils/javascript_utils.js";

import { browserExt } from "../src/environment-browser/browserExt.mjs";
import { webworkerExt } from "../src/environment-webworker/webworkerExt.mjs";
import { extensions } from "../src/extensions/Extensions.mjs";

extensions.add(browserExt, webworkerExt);

const exampleRelativePath = [
	"../examples/src/scene/sprite/sprite.js",
	"../examples/src/scene/text/text_fill_gradient.js",
];

// 1. 获取 URL 中的 exampleUrl 参数
const exampleId = getInitUrlSearchParam("exampleId");

if (exampleId) {
	import(exampleRelativePath[Number(exampleId)]);
} else {
	throw new Error("exampleId 参数不存在");
}
