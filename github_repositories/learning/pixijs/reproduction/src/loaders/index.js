/**
 * @file        Main export of the PIXI loaders library
 * @author      Mat Groves <mat@goodboydigital.com>
 * @copyright   2013-2015 GoodBoyDigital
 * @license     {@link https://github.com/pixijs/pixi.js/blob/master/LICENSE|MIT License}
 */

/**
 * @namespace PIXI.loaders
 */
import Loader from './loader.js';
import bitmapFontParser from './bitmapFontParser.js';
import spritesheetParser from './spritesheetParser.js';
import textureParser from './textureParser.js';


const loaders = {
	Loader,
	bitmapFontParser,
	spritesheetParser,
	textureParser,
	Resource: ResourceLoader.Resource,
};

export default loaders;