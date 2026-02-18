import { DOMAdapter } from "../../../../../environment/adapter.js";

("use strict");
let context;
function getTestContext() {
	if (!context || context?.isContextLost()) {
		const canvas = DOMAdapter.get().createCanvas();
		context = canvas.getContext("webgl", {});
	}
	return context;
}

export { getTestContext };
