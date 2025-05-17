/**
 * Additional PIXI DisplayObjects for animation, tiling and bitmap text.
 * @namespace PIXI.extras
 */
export { default as AnimatedSprite } from './AnimatedSprite.js';
export { default as TilingSprite } from './TilingSprite.js';
export { default as TilingSpriteRenderer } from './webgl/TilingSpriteRenderer.js';
export { default as BitmapText } from './BitmapText.js';

// imported for side effect of extending the prototype only, contains no exports
import './cacheAsBitmap.js';
import './getChildByName.js';
import './getGlobalPosition.js';
