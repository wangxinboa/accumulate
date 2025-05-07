/**
 * @file        Main export of the PIXI extras library
 * @author      Mat Groves <mat@goodboydigital.com>
 * @copyright   2013-2015 GoodBoyDigital
 * @license     {@link https://github.com/pixijs/pixi.js/blob/master/LICENSE|MIT License}
 */
import './cacheAsBitmap.js';
import './getChildByName.js';
import './getGlobalPosition.js';

import MovieClip from './MovieClip.js';
import TilingSprite from './TilingSprite.js';
import BitmapText from './BitmapText.js';

/**
 * @namespace PIXI.extras
 */
const extras = {
	MovieClip,
	TilingSprite,
	BitmapText,
};


export default extras;