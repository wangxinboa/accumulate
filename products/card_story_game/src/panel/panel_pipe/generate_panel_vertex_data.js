/**
 * 辅助函数：向 Float32Array 写入单个顶点数据
 * @param {Float32Array} array - 目标数组
 * @param {number} index - 顶点索引（从0开始）
 * @param {number} x - 位置X
 * @param {number} y - 位置Y
 * @param {number} u - 纹理坐标U
 * @param {number} v - 纹理坐标V
 * @param {number} isBg - 是否背景（1背景，0文字矩形）
 * @param {number} texIndex - 纹理索引（0标题，1描述）
 */
function _setVertex(array, index, x, y, u, v, isBg, texIndex) {
	const base = index * 6;
	array[base] = x;
	array[base + 1] = y;
	array[base + 2] = u;
	array[base + 3] = v;
	array[base + 4] = isBg;
	array[base + 5] = texIndex;
}

/**
 * 生成 Panel 的顶点数据（背景 + 标题矩形 + 描述矩形）
 * 背景占满整个面板。
 * 标题矩形：由 panel.titleHeight 控制，位置由 titleX/titleY 控制。
 * 描述矩形：位置由 panel.descRect 控制，但宽高直接使用纹理的实际尺寸（保持原始字体大小）
 *
 * @param {CardStoryGameType.Panel} panel
 * @returns {Float32Array}
 */
export function generatePanelVertexData(panel) {
	const width = panel.width;
	const height = panel.height;

	// ---- 标题纹理宽高 ----
	let titleTexWidth = 1,
		titleTexHeight = 1;
	if (panel.titleTexture && panel.titleTexture.isReady) {
		titleTexWidth = panel.titleTexture.width;
		titleTexHeight = panel.titleTexture.height;
	}
	const titleAspect = titleTexWidth / titleTexHeight;
	const titleHeight = panel.titleHeight;
	const titleWidth = titleHeight * titleAspect;
	const titleX = panel.titleX;
	const titleY = panel.titleY;

	// ---- 描述纹理实际宽高 ----
	let descTexWidth = 1,
		descTexHeight = 1;
	if (panel.descriptionTexture && panel.descriptionTexture.isReady) {
		descTexWidth = panel.descriptionTexture.width;
		descTexHeight = panel.descriptionTexture.height;
	}
	// 直接使用纹理尺寸，不缩放
	const descRect = panel.descRect;
	const dX = descRect.x;
	const dY = descRect.y;
	const dW = descTexWidth;
	const dH = descTexHeight;

	const floatArray = new Float32Array(18 * 6); // 18 顶点 * 6 分量

	// ---- 背景矩形（6 个顶点） ----
	_setVertex(floatArray, 0, 0, 0, 0, 0, 1, 0);
	_setVertex(floatArray, 1, width, 0, 0, 0, 1, 0);
	_setVertex(floatArray, 2, 0, height, 0, 0, 1, 0);
	_setVertex(floatArray, 3, 0, height, 0, 0, 1, 0);
	_setVertex(floatArray, 4, width, 0, 0, 0, 1, 0);
	_setVertex(floatArray, 5, width, height, 0, 0, 1, 0);

	// ---- 标题矩形（6 个顶点） ----
	_setVertex(floatArray, 6, titleX, titleY, 0, 1, 0, 0);
	_setVertex(floatArray, 7, titleX + titleWidth, titleY, 1, 1, 0, 0);
	_setVertex(floatArray, 8, titleX, titleY + titleHeight, 0, 0, 0, 0);
	_setVertex(floatArray, 9, titleX, titleY + titleHeight, 0, 0, 0, 0);
	_setVertex(floatArray, 10, titleX + titleWidth, titleY, 1, 1, 0, 0);
	_setVertex(floatArray, 11, titleX + titleWidth, titleY + titleHeight, 1, 0, 0, 0);

	// ---- 描述矩形（6 个顶点） ----
	_setVertex(floatArray, 12, dX, dY, 0, 1, 0, 1);
	_setVertex(floatArray, 13, dX + dW, dY, 1, 1, 0, 1);
	_setVertex(floatArray, 14, dX, dY + dH, 0, 0, 0, 1);
	_setVertex(floatArray, 15, dX, dY + dH, 0, 0, 0, 1);
	_setVertex(floatArray, 16, dX + dW, dY, 1, 1, 0, 1);
	_setVertex(floatArray, 17, dX + dW, dY + dH, 1, 0, 0, 1);

	return floatArray;
}
