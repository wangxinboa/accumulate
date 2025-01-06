import { getFabricDocument } from '../../env/index.mjs';
import { FabricError } from '../internals/console.mjs';

/**
 * Creates canvas element
 * @return {CanvasElement} initialized canvas element
 */
const createCanvasElement = fabricJsFunctionMark(() => {
  const element = getFabricDocument().createElement('canvas');
  if (!element || typeof element.getContext === 'undefined') {
    throw new FabricError('Failed to create `canvas` element');
  }
  return element;
}, 'createCanvasElement');

/**
 * Creates image element (works on client and node)
 * @return {HTMLImageElement} HTML image element
 */
const createImage = fabricJsFunctionMark(() => getFabricDocument().createElement('img'), 'createImage');

/**
 * Creates a canvas element that is a copy of another and is also painted
 * @param {CanvasElement} canvas to copy size and content of
 * @return {CanvasElement} initialized canvas element
 */
const copyCanvasElement = fabricJsFunctionMark(canvas => {
  var _newCanvas$getContext;
  const newCanvas = createCanvasElementFor(canvas);
  (_newCanvas$getContext = newCanvas.getContext('2d')) === null || _newCanvas$getContext === void 0 || _newCanvas$getContext.drawImage(canvas, 0, 0);
  return newCanvas;
}, 'copyCanvasElement');
const createCanvasElementFor = fabricJsFunctionMark(canvas => {
  const newCanvas = createCanvasElement();
  newCanvas.width = canvas.width;
  newCanvas.height = canvas.height;
  return newCanvas;
}, 'createCanvasElementFor');

/**
 * since 2.6.0 moved from canvas instance to utility.
 * possibly useless
 * @param {CanvasElement} canvasEl to copy size and content of
 * @param {String} format 'jpeg' or 'png', in some browsers 'webp' is ok too
 * @param {Number} quality <= 1 and > 0
 * @return {String} data url
 */
const toDataURL = fabricJsFunctionMark((canvasEl, format, quality) => canvasEl.toDataURL("image/".concat(format), quality), 'toDataURL');
const isHTMLCanvas = fabricJsFunctionMark(canvas => {
  return !!canvas && canvas.getContext !== undefined;
}, 'isHTMLCanvas');

export { copyCanvasElement, createCanvasElement, createCanvasElementFor, createImage, isHTMLCanvas, toDataURL };
//# sourceMappingURL=dom.mjs.map
