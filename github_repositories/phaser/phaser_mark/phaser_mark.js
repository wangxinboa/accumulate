import '../../../tools/code_analysis/javascript/code_mark/global_api.js';

import { phaserClassCache, phaserClassAlias } from './phaser_cache.js';


globalThis.phaserClassCache = phaserClassCache;

globalThis.phaserClassMark = function phaserClassMark(phaserClass, aliasName) {
	let className = aliasName || phaserClass.name;
	const aliasMessaage = phaserClassAlias[className];
	if (aliasMessaage) {
		className = aliasMessaage.alias[aliasMessaage.nowIndex++];
	}

	return codeMarkClass(phaserClass, className);
}

globalThis.phaserFunctionMark = codeMarkFunction;
globalThis.phaserObjectMark = codeMarkObject;
