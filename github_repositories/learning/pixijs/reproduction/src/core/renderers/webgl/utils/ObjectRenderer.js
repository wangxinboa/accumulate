import WebGLManager from '../managers/WebGLManager.js';

/**
 * Base for a common object renderer that can be used as a system renderer plugin.
 *
 * @class
 * @extends PIXI.WebGLManager
 * @memberof PIXI
 * @param renderer {PIXI.WebGLRenderer} The renderer this object renderer works for.
 */
export default function ObjectRenderer(renderer) {
	WebGLManager.call(this, renderer);
}


ObjectRenderer.prototype = Object.create(WebGLManager.prototype);
ObjectRenderer.prototype.constructor = ObjectRenderer;

/**
 * Starts the renderer and sets the shader
 *
 */
ObjectRenderer.prototype.start = function () {
	// set the shader..
};

/**
 * Stops the renderer
 *
 */
ObjectRenderer.prototype.stop = function () {
	this.flush();
};

/**
 * flushes
 *
 */
ObjectRenderer.prototype.flush = function () {
	// flush!
};

/**
 * Renders an object
 *
 * @param object {PIXI.DisplayObject} The object to render.
 */
ObjectRenderer.prototype.render = function (object) // jshint unused:false
{
	// render the object
};
