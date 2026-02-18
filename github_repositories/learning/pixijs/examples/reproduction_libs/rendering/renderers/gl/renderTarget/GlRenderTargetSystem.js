import renderTargetSystem from "../../shared/renderTarget/RenderTargetSystem.js";
import glRenderTargetAdaptor from "./GlRenderTargetAdaptor.js";

const glRenderTargetSystem = {
	...renderTargetSystem,
	adaptor: glRenderTargetAdaptor,
};

export default glRenderTargetSystem;
