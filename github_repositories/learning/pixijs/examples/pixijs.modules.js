import { getUrlSearchParam } from "../../../../javascript_libs/javascript_utils/url/get_url_search_param.js";

import { browserExt } from "../src/environment-browser/browserExt.mjs";
import { webworkerExt } from "../src/environment-webworker/webworkerExt.mjs";
import { extensions } from "../src/extensions/Extensions.mjs";

extensions.add(browserExt, webworkerExt);

// 1. 获取 URL 中的 exampleUrl 参数
const exampleUrl = getUrlSearchParam("exampleUrl");

import(exampleUrl);

// 对照源码
// import("../examples/src/scene/sprite/sprite.js");
// import("../examples/src/scene/text/text_fill_gradient.js");
