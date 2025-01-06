import { WebGLProbe } from '../filters/GLProbes/WebGLProbe.mjs';

/* eslint-disable no-restricted-globals */
const copyPasteData = {};
const getEnv = fabricJsFunctionMark(() => {
  return {
    document,
    window,
    isTouchSupported: 'ontouchstart' in window || 'ontouchstart' in document || window && window.navigator && window.navigator.maxTouchPoints > 0,
    WebGLProbe: new WebGLProbe(),
    dispose() {
      // noop
    },
    copyPasteData
  };
}, 'src/env/browser.mjs getEnv');

export { getEnv };
//# sourceMappingURL=browser.mjs.map
