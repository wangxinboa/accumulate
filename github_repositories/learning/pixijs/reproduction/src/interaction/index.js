/**
 * @file        Main export of the PIXI interactions library
 * @author      Mat Groves <mat@goodboydigital.com>
 * @copyright   2013-2015 GoodBoyDigital
 * @license     {@link https://github.com/pixijs/pixi.js/blob/master/LICENSE|MIT License}
 */
import InteractionData from './InteractionData.js';
import InteractionManager from './InteractionManager.js';
import interactiveTarget from './interactiveTarget.js';

const interaction = {
	InteractionData,
	InteractionManager,
	interactiveTarget,
};
export default interaction;