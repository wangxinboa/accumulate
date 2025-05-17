// import polyfills. Done as an export to make sure polyfills are imported first
// export * from './polyfill';

// export core
// import './deprecation.js';
import * as core from './core/index.js';

// export libs
import * as accessibility from './accessibility/index.js';
import * as extract from './extract/index.js';
import * as extras from './extras/index.js';
import * as filters from './filters/index.js';
import * as interaction from './interaction/index.js';
import * as loaders from './loaders/index.js';
import * as mesh from './mesh/index.js';
// import * as particles from './particles/index.js';
import * as prepare from './prepare/index.js';

// handle mixins now, after all code has been added, including deprecation
import { utils } from './core/index.js';
utils.mixins.performMixins();

/**
 * Alias for {@link PIXI.loaders.shared}.
 * @name loader
 * @memberof PIXI
 * @type {PIXI.loader.Loader}
 */
const loader = loaders.shared || null;

globalThis.PIXI = {
	...core,
	accessibility,
	extract,
	extras,
	filters,
	interaction,
	loaders,
	mesh,
	// particles,
	prepare,
	loader,
};
