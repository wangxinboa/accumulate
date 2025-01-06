import { getFabricWindow } from '../../env/index.mjs';

const requestAnimFrame = fabricJsFunctionMark(function requestAnimFrame(callback) {
  return getFabricWindow().requestAnimationFrame(callback);
})
const cancelAnimFrame = fabricJsFunctionMark(function cancelAnimFrame(handle) {
  return getFabricWindow().cancelAnimationFrame(handle);
})

export { cancelAnimFrame, requestAnimFrame };
//# sourceMappingURL=AnimationFrameProvider.mjs.map
