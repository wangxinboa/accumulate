"use strict";
var RendererType = ((RendererType2) => {
	RendererType2[(RendererType2["WEBGL"] = 1)] = "WEBGL";
	RendererType2[(RendererType2["WEBGPU"] = 2)] = "WEBGPU";
	RendererType2[(RendererType2["BOTH"] = 3)] = "BOTH";
	return RendererType2;
})(RendererType || {});

export { RendererType };
