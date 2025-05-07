/**
 * @file        Main export of the PIXI core library
 * @author      Mat Groves <mat@goodboydigital.com>
 * @copyright   2013-2015 GoodBoyDigital
 * @license     {@link https://github.com/pixijs/pixi.js/blob/master/LICENSE|MIT License}
 */
import CONST from './const.js';

import utils from './utils/index.js';
import ticker from './ticker/index.js';

import DisplayObject from './display/DisplayObject.js';
import Container from './display/Container.js';

import Sprite from './sprites/Sprite.js';
import ParticleContainer from './particles/ParticleContainer.js';
import SpriteRenderer from './sprites/webgl/SpriteRenderer.js';
import ParticleRenderer from './particles/webgl/ParticleRenderer.js';

import Text from './text/Text.js';

import Graphics from './graphics/Graphics.js';
import GraphicsData from './graphics/GraphicsData.js';
import GraphicsRenderer from './graphics/webgl/GraphicsRenderer.js';

import * as math from './math/index.js';

import Texture from './textures/Texture.js';
import BaseTexture from './textures/BaseTexture.js';
import RenderTexture from './textures/RenderTexture.js';
import VideoBaseTexture from './textures/VideoBaseTexture.js';
import TextureUvs from './textures/TextureUvs.js';

import CanvasRenderer from './renderers/canvas/CanvasRenderer.js';
import CanvasGraphics from './renderers/canvas/utils/CanvasGraphics.js';
import CanvasBuffer from './renderers/canvas/utils/CanvasBuffer.js';

import WebGLRenderer from './renderers/webgl/WebGLRenderer.js';
import WebGLManager from './renderers/webgl/managers/WebGLManager.js';
import ShaderManager from './renderers/webgl/managers/ShaderManager.js';
import Shader from './renderers/webgl/shaders/Shader.js';
import ObjectRenderer from './renderers/webgl/utils/ObjectRenderer.js';
import RenderTarget from './renderers/webgl/utils/RenderTarget.js';

import AbstractFilter from './renderers/webgl/filters/AbstractFilter.js';
import FXAAFilter from './renderers/webgl/filters/FXAAFilter.js';
import SpriteMaskFilter from './renderers/webgl/filters/SpriteMaskFilter.js';

/**
 * @namespace PIXI
 */
// export core and const. We assign core to const so that the non-reference types in const remain in-tact
var core = Object.assign(CONST, math, {
	// utils
	utils,
	ticker,

	// display
	DisplayObject,
	Container,

	// sprites
	Sprite,
	ParticleContainer,
	SpriteRenderer,
	ParticleRenderer,

	// text
	Text,

	// primitives
	Graphics,
	GraphicsData,
	GraphicsRenderer,

	// textures
	Texture,
	BaseTexture,
	RenderTexture,
	VideoBaseTexture,
	TextureUvs,

	// renderers - canvas
	CanvasRenderer,
	CanvasGraphics,
	CanvasBuffer,

	// renderers - webgl
	WebGLRenderer,
	WebGLManager,
	ShaderManager,
	Shader,
	ObjectRenderer,
	RenderTarget,

	// filters - webgl
	AbstractFilter,
	FXAAFilter,
	SpriteMaskFilter,

	/**
	 * This helper function will automatically detect which renderer you should be using.
	 * WebGL is the preferred renderer as it is a lot faster. If webGL is not supported by
	 * the browser then this function will return a canvas renderer
	 *
	 * @memberof PIXI
	 * @param width=800 {number} the width of the renderers view
	 * @param height=600 {number} the height of the renderers view
	 * @param [options] {object} The optional renderer parameters
	 * @param [options.view] {HTMLCanvasElement} the canvas to use as a view, optional
	 * @param [options.transparent=false] {boolean} If the render view is transparent, default false
	 * @param [options.antialias=false] {boolean} sets antialias (only applicable in chrome at the moment)
	 * @param [options.preserveDrawingBuffer=false] {boolean} enables drawing buffer preservation, enable this if you
	 *      need to call toDataUrl on the webgl context
	 * @param [options.resolution=1] {number} the resolution of the renderer, retina would be 2
	 * @param [noWebGL=false] {boolean} prevents selection of WebGL renderer, even if such is present
	 *
	 * @return {WebGLRenderer|CanvasRenderer} Returns WebGL renderer if available, otherwise CanvasRenderer
	 */
	autoDetectRenderer: function (width, height, options, noWebGL) {
		width = width || 800;
		height = height || 600;

		if (!noWebGL && core.utils.isWebGLSupported()) {
			return new core.WebGLRenderer(width, height, options);
		}

		return new core.CanvasRenderer(width, height, options);
	}
});

export default core;