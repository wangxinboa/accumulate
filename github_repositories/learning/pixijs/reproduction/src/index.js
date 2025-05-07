import core from './core/index.js';
import extras from './extras/index.js';
import filters from './filters/index.js';
import interaction from './interaction/index.js';
import loaders from './loaders/index.js';
import mesh from './mesh/index.js';
import accessibility from './accessibility/index.js';

import './deprecation.js';

core.extras = extras;
core.filters = filters;
core.interaction = interaction;;
core.loaders = loaders;
core.mesh = mesh;
core.accessibility = accessibility;

/**
 * A premade instance of the loader that can be used to loader resources.
 *
 * @name loader
 * @memberof PIXI
 * @property {PIXI.loaders.Loader}
 */
core.loader = new core.loaders.Loader();

// Always export pixi globally.
globalThis.PIXI = core;
