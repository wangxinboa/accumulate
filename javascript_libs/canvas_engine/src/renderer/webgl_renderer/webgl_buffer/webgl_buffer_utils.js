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
