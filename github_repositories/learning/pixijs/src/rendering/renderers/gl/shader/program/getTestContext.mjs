import { DOMAdapter } from "../../../../../environment/adapter.mjs";

("use strict");
/**
 * @type {WebGLRenderingContext | null}
 */
let context;
function getTestContext() {
	if (!context || context?.isContextLost()) {
		const canvas = DOMAdapter.get().createCanvas();
		context = canvas.getContext("webgl", {});
	}
	return context;
}

export { getTestContext };
//# sourceMappingURL=getTestContext.mjs.map
