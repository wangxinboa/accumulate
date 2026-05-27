globalThis.allowConsoleTime = false;

/**
 * @param {string} label
 */
export function ControlledConsoleTime(label) {
	if (globalThis.allowConsoleTime) {
		console.time(label);
	}
}
/**
 * @param {string} label
 */
export function ControlledConsoleTimeEnd(label) {
	if (globalThis.allowConsoleTime) {
		console.timeEnd(label);
	}
}
