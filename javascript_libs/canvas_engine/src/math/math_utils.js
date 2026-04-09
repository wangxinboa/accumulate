export const PiDivide180 = Math.PI / 180;
/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
	return Math.max(min, Math.min(max, value));
}

/**
 * @param {number} hex
 */
export function getHexR(hex) {
	return ((hex >> 16) & 255) / 255;
}
/**
 * @param {number} hex
 */
export function getHexG(hex) {
	return ((hex >> 8) & 255) / 255;
}
/**
 * @param {number} hex
 */
export function getHexB(hex) {
	return (hex & 255) / 255;
}
