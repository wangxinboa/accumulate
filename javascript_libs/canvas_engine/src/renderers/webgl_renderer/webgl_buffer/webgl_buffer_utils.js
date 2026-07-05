/**
 * @param {number} width
 * @param {number} height
 */
export function getPositionUvFloat32ArrayFromWidthAndHeight(width, height) {
	// Implementation for creating buffer from width and height

	return new Float32Array([
		// 位置x,y, 纹理坐标u,v
		0,
		0,
		0,
		1, // 左下
		width,
		0,
		1,
		1, // 右下
		0,
		height,
		0,
		0, // 左上
		0,
		height,
		0.0,
		0.0, // 左上
		width,
		0,
		1,
		1, // 右下
		width,
		height,
		1,
		0, // 右上
	]);
}

/**
 * 生成直径为 diameter 的矩形顶点位置（仅位置，无 UV）。
 * 返回 Float32Array，格式为 [x1, y1, x2, y2, ...]，共 6 个顶点（两个三角形）。
 * @param {number} diameter
 */
export function getPositionFloat32ArrayFromDiameter(diameter) {
	return new Float32Array([
		// 三角形1：左下、右下、左上
		0,
		0,
		diameter,
		0,
		0,
		diameter,
		// 三角形2：左上、右下、右上
		0,
		diameter,
		diameter,
		0,
		diameter,
		diameter,
	]);
}
