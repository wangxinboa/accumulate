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
 * 从十六进制整数中提取 R 通道（0~1 归一化）
 * @param {number} hex
 * @returns {number}
 */
export function getHexR(hex) {
	return ((hex >> 16) & 255) / 255;
}

/**
 * 从十六进制整数中提取 G 通道（0~1 归一化）
 * @param {number} hex
 * @returns {number}
 */
export function getHexG(hex) {
	return ((hex >> 8) & 255) / 255;
}

/**
 * 从十六进制整数中提取 B 通道（0~1 归一化）
 * @param {number} hex
 * @returns {number}
 */
export function getHexB(hex) {
	return (hex & 255) / 255;
}

/**
 * 从 0~1 归一化 RGB 值生成带 # 的十六进制颜色字符串
 * @param {number} r - 0~1 归一化值
 * @param {number} g - 0~1 归一化值
 * @param {number} b - 0~1 归一化值
 * @returns {string} 格式如 "#ff0000"
 */
export function rgbToHexString(r, g, b) {
	const ri = Math.round(r * 255);
	const gi = Math.round(g * 255);
	const bi = Math.round(b * 255);
	return "#" + ((1 << 24) + (ri << 16) + (gi << 8) + bi).toString(16).slice(1);
}
