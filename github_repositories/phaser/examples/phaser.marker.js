import {
	phaserClassMark,
	phaserFunMark,
	phaserObjectFunMark,
} from '../phaser_mark/phaser_mark.js';
import { phaserClassCache } from '../phaser_mark/phaser_cache.js';
import { AllMarkFunction } from '../../../tools/code_analysis/javascript/code_mark/mark_function.js';
import MarkLogs from '../../../tools/code_analysis/javascript/code_mark/mark_logs.js';


globalThis.phaserClassMark = phaserClassMark;
globalThis.phaserFunMark = phaserFunMark;
globalThis.phaserObjectFunMark = phaserObjectFunMark;

globalThis.phaserClassCache = phaserClassCache;

globalThis.AllMarkFunction = AllMarkFunction;
globalThis.MarkLogs = MarkLogs;
