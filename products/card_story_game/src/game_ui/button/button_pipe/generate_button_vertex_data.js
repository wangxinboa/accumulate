/**
 * 辅助函数：向 Float32Array 写入单个顶点数据
 * @param {Float32Array} array - 目标数组
 * @param {number} index - 顶点索引（从0开始）
 * @param {number} x - 位置X
 * @param {number} y - 位置Y
 * @param {number} u - 纹理坐标U
 * @param {number} v - 纹理坐标V
 * @param {number} isBg - 是否背景（1背景，0文字矩形）
 */
function _setVertex(array, index, x, y, u, v, isBg) {
	const base = index * 5;
	array[base] = x;
	array[base + 1] = y;
	array[base + 2] = u;
	array[base + 3] = v;
	array[base + 4] = isBg;
}

/**
 * 生成 Button 的顶点数据（背景 + 文字矩形）
 * 坐标：矩形左下角为原点，Y 向上
 * 文字区域会扣除 padding 后按 contain 缩放并居中
 * @param {CardStoryGameType.Button} button
 * @returns {Float32Array}
 */
export function generateButtonVertexData(button) {
	const width = button.width;
	const height = button.height;

	// 文字矩形边界（Y 向上）
	const textRectX = button.padding.left;
	const textRectY = button.padding.top;
	const textRectW = button.textTexture.width;
	const textRectH = button.textTexture.height;

	// 分配 12 个顶点（6背景 + 6文字）
	const floatArray = new Float32Array(12 * 5);

	// 背景矩形（覆盖整个按钮）
	_setVertex(floatArray, 0, 0, 0, 0, 0, 1);
	_setVertex(floatArray, 1, width, 0, 0, 0, 1);
	_setVertex(floatArray, 2, 0, height, 0, 0, 1);
	_setVertex(floatArray, 3, 0, height, 0, 0, 1);
	_setVertex(floatArray, 4, width, 0, 0, 0, 1);
	_setVertex(floatArray, 5, width, height, 0, 0, 1);

	// 文字矩形（纹理坐标：左下(0,1) -> 右下(1,1) -> 左上(0,0) -> 右上(1,0)）
	_setVertex(floatArray, 6, textRectX, textRectY, 0, 1, 0);
	_setVertex(floatArray, 7, textRectX + textRectW, textRectY, 1, 1, 0);
	_setVertex(floatArray, 8, textRectX, textRectY + textRectH, 0, 0, 0);
	_setVertex(floatArray, 9, textRectX, textRectY + textRectH, 0, 0, 0);
	_setVertex(floatArray, 10, textRectX + textRectW, textRectY, 1, 1, 0);
	_setVertex(floatArray, 11, textRectX + textRectW, textRectY + textRectH, 1, 0, 0);

	return floatArray;
}
