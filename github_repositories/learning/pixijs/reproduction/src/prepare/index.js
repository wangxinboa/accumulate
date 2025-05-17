/**
 * The prepare namespace provides renderer-specific plugins for pre-rendering DisplayObjects. These plugins are useful for
 * asynchronously preparing assets, textures, graphics waiting to be displayed.
 *
 * Do not instantiate these plugins directly. It is available from the `renderer.plugins` property.
 * See {@link PIXI.CanvasRenderer#plugins} or {@link PIXI.WebGLRenderer#plugins}.
 * @example
 * // Create a new application
 * const app = new PIXI.Application();
 * document.body.appendChild(app.view);
 *
 * // Don't start rendering right away
 * app.stop();
 *
 * // create a display object
 * const rect = new PIXI.Graphics()
 *     .beginFill(0x00ff00)
 *     .drawRect(40, 40, 200, 200);
 *
 * // Add to the stage
 * app.stage.addChild(rect);
 *
 * // Don't start rendering until the graphic is uploaded to the GPU
 * app.renderer.plugins.prepare.upload(app.stage, () => {
 *     app.start();
 * });
 * @namespace PIXI.prepare
 */
export { default as webgl } from './webgl/WebGLPrepare.js';
export { default as canvas } from './canvas/CanvasPrepare.js';
export { default as BasePrepare } from './BasePrepare.js';
export { default as CountLimiter } from './limiters/CountLimiter.js';
export { default as TimeLimiter } from './limiters/TimeLimiter.js';
