/**
 * This namespace contains WebGL-only display filters that can be applied
 * to DisplayObjects using the {@link PIXI.DisplayObject#filters filters} property.
 * @example
 * // Create a new application
 * const app = new PIXI.Application();
 *
 * // Draw a green rectangle
 * const rect = new PIXI.Graphics()
 *     .beginFill(0x00ff00)
 *     .drawRect(40, 40, 200, 200);
 *
 * // Add a blur filter
 * rect.filters = [new PIXI.filters.BlurFilter()];
 *
 * // Display rectangle
 * app.stage.addChild(rect);
 * document.body.appendChild(app.view);
 * @namespace PIXI.filters
 */
// export { default as FXAAFilter } from './fxaa/FXAAFilter.js';
// export { default as NoiseFilter } from './noise/NoiseFilter.js';
// export { default as DisplacementFilter } from './displacement/DisplacementFilter.js';
// export { default as BlurFilter } from './blur/BlurFilter.js';
// export { default as BlurXFilter } from './blur/BlurXFilter.js';
// export { default as BlurYFilter } from './blur/BlurYFilter.js';
export { default as ColorMatrixFilter } from './colormatrix/ColorMatrixFilter.js';
// export { default as VoidFilter } from './void/VoidFilter.js';
