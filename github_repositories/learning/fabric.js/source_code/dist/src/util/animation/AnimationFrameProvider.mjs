import { getFabricWindow } from '../../env/index.mjs';

const requestAnimFrame = codeMarkFunction(function requestAnimFrame(callback) {
	return getFabricWindow().requestAnimationFrame(callback);
})
const cancelAnimFrame = codeMarkFunction(function cancelAnimFrame(handle) {
	return getFabricWindow().cancelAnimationFrame(handle);
})

export { cancelAnimFrame, requestAnimFrame };
//# sourceMappingURL=AnimationFrameProvider.mjs.map
