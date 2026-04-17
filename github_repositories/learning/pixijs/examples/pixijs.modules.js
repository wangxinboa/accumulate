// reproduction

import { browserExt } from "../src/environment-browser/browserExt.mjs";
import { webworkerExt } from "../src/environment-webworker/webworkerExt.mjs";
import { extensions } from "../src/extensions/Extensions.mjs";

extensions.add(browserExt, webworkerExt);

// 对照源码
// import("../examples/src/scene/sprite/sprite.js");
import("../examples/src/scene/text/text_fill_gradient.js");
