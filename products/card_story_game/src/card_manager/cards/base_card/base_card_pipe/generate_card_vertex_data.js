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
 * 生成 BaseCard 的顶点数据（背景 + 文字矩形）
 * 返回 Float32Array，每5个分量一个顶点：[x, y, u, v, isBg]
 * 共12个顶点（背景6个，文字6个），总长度 60。
 *
 * @param {CardStoryGameType.BaseCard} card
 * @returns {Float32Array}
 */
export function generateCardVertexData(card) {
	const width = card.width;
	const height = card.height;
	const textHeight = width / 3;

	// 获取纹理宽高，若未准备好则使用1x1
	let texWidth = 1;
	let texHeight = 1;
	if (card.textTexture && card.textTexture.isReady) {
		texWidth = card.textTexture.width;
		texHeight = card.textTexture.height;
	}

	// 计算文字矩形的 contain 缩放及偏移
	const aspect = texWidth / texHeight;
	const rectAspect = width / textHeight;
	let drawWidth, drawHeight;
	if (aspect > rectAspect) {
		drawWidth = width;
		drawHeight = width / aspect;
	} else {
		drawHeight = textHeight;
		drawWidth = textHeight * aspect;
	}
	const offsetX = (width - drawWidth) / 2;
	const offsetY = (textHeight - drawHeight) / 2;

	// 分配缓冲区：12个顶点 * 5个分量
	const floatArray = new Float32Array(60);

	// ---- 背景矩形（6个顶点，两个三角形） ----
	// 三角形1：左下、右下、左上
	_setVertex(floatArray, 0, 0, 0, 0, 0, 1);
	_setVertex(floatArray, 1, width, 0, 0, 0, 1);
	_setVertex(floatArray, 2, 0, height, 0, 0, 1);
	// 三角形2：左上、右下、右上
	_setVertex(floatArray, 3, 0, height, 0, 0, 1);
	_setVertex(floatArray, 4, width, 0, 0, 0, 1);
	_setVertex(floatArray, 5, width, height, 0, 0, 1);

	// ---- 文字矩形（6个顶点） ----
	// 三角形1：左下、右下、左上
	_setVertex(floatArray, 6, offsetX, offsetY, 0, 1, 0);
	_setVertex(floatArray, 7, offsetX + drawWidth, offsetY, 1, 1, 0);
	_setVertex(floatArray, 8, offsetX, offsetY + drawHeight, 0, 0, 0);
	// 三角形2：左上、右下、右上
	_setVertex(floatArray, 9, offsetX, offsetY + drawHeight, 0, 0, 0);
	_setVertex(floatArray, 10, offsetX + drawWidth, offsetY, 1, 1, 0);
	_setVertex(floatArray, 11, offsetX + drawWidth, offsetY + drawHeight, 1, 0, 0);

	return floatArray;
}
