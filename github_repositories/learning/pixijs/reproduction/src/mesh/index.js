/**
 * @file        Main export of the PIXI extras library
 * @author      Mat Groves <mat@goodboydigital.com>
 * @copyright   2013-2015 GoodBoyDigital
 * @license     {@link https://github.com/pixijs/pixi.js/blob/master/LICENSE|MIT License}
 */

/**
 * @namespace PIXI.mesh
 */
import Mesh from './Mesh.js';
import Plane from './Plane.js';
import Rope from './Rope.js';
import MeshRenderer from './webgl/MeshRenderer.js';
import MeshShader from './webgl/MeshShader.js';

const mesh = {
	Mesh,
	Plane,
	Rope,
	MeshRenderer,
	MeshShader,
};

export default mesh;