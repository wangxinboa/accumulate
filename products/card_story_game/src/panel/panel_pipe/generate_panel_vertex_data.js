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
 * 标题矩形：由 panel.titleHeight 控制，位置由 titleX/titleY 控制（titleY 是从顶部向下的偏移）。
 * 描述矩形：使用 panel.descVisibleWidth 和 panel.descVisibleHeight 作为顶点尺寸，
 *           纹理坐标始终保持 0-1，滚动通过 UV 变换矩阵实现。
 *
 * 适配 Y 向上的坐标系：面板局部坐标原点在左下角，顶部为 y=panelHeight。
 * 因此将 titleY 和 descRect.y（从顶部向下的偏移）转换为 Y 坐标：y = panelHeight - 偏移 - 高度。
 *
 * @param {CardStoryGameType.Panel} panel
 * @returns {Float32Array}
 */
export function generatePanelVertexData(panel) {
	const panelWidth = panel.width;
	const panelHeight = panel.height;

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
	const titleYOffset = panel.titleY; // 从顶部向下的偏移

	// ---- 描述矩形：使用 Panel 计算好的可见尺寸 ----
	const descRect = panel.descRect;
	const dX = descRect.x;
	const dYOffset = descRect.y; // 从顶部向下的偏移
	const dW = panel.descVisibleWidth;
	const dH = panel.descVisibleHeight;

	// 计算 Y 坐标（在 Y 向上的坐标系中，顶部为 panelHeight）
	const titleY = panelHeight - titleYOffset - titleHeight;
	const descY = panelHeight - dYOffset - dH;

	const floatArray = new Float32Array(18 * 6); // 18 顶点 * 6 分量

	// ---- 背景矩形（6 个顶点） ----
	_setVertex(floatArray, 0, 0, 0, 0, 0, 1, 0);
	_setVertex(floatArray, 1, panelWidth, 0, 0, 0, 1, 0);
	_setVertex(floatArray, 2, 0, panelHeight, 0, 0, 1, 0);
	_setVertex(floatArray, 3, 0, panelHeight, 0, 0, 1, 0);
	_setVertex(floatArray, 4, panelWidth, 0, 0, 0, 1, 0);
	_setVertex(floatArray, 5, panelWidth, panelHeight, 0, 0, 1, 0);

	// ---- 标题矩形（6 个顶点） ----
	_setVertex(floatArray, 6, titleX, titleY, 0, 1, 0, 0);
	_setVertex(floatArray, 7, titleX + titleWidth, titleY, 1, 1, 0, 0);
	_setVertex(floatArray, 8, titleX, titleY + titleHeight, 0, 0, 0, 0);
	_setVertex(floatArray, 9, titleX, titleY + titleHeight, 0, 0, 0, 0);
	_setVertex(floatArray, 10, titleX + titleWidth, titleY, 1, 1, 0, 0);
	_setVertex(floatArray, 11, titleX + titleWidth, titleY + titleHeight, 1, 0, 0, 0);

	// ---- 描述矩形（6 个顶点） ----
	// 纹理坐标始终为 0-1，滚动由着色器中的 UV 变换矩阵处理
	_setVertex(floatArray, 12, dX, descY, 0, 1, 0, 1);
	_setVertex(floatArray, 13, dX + dW, descY, 1, 1, 0, 1);
	_setVertex(floatArray, 14, dX, descY + dH, 0, 0, 0, 1);
	_setVertex(floatArray, 15, dX, descY + dH, 0, 0, 0, 1);
	_setVertex(floatArray, 16, dX + dW, descY, 1, 1, 0, 1);
	_setVertex(floatArray, 17, dX + dW, descY + dH, 1, 0, 0, 1);

	return floatArray;
}
