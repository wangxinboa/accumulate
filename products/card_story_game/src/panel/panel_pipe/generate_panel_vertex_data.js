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
 * 生成 Panel 的顶点数据（背景 + 文字矩形）
 * 背景占满整个面板。
 * 标题矩形：高度由 panel.titleHeight 控制，宽度由高度 × 纹理宽高比决定，
 * 位置由 panel.titleX 和 panel.titleY 控制。
 *
 * @param {CardStoryGameType.Panel} panel
 * @returns {Float32Array}
 */
export function generatePanelVertexData(panel) {
	const width = panel.width;
	const height = panel.height;

	// 获取纹理宽高，若未准备好则使用 1x1
	let texWidth = 1;
	let texHeight = 1;
	if (panel.titleTexture && panel.titleTexture.isReady) {
		texWidth = panel.titleTexture.width;
		texHeight = panel.titleTexture.height;
	}
	const aspect = texWidth / texHeight;

	// 从 panel 实例读取标题绘制参数（带默认值）
	const titleHeight = panel.titleHeight;
	const titleX = panel.titleX;
	const titleY = panel.titleY;

	// 标题宽度 = 高度 × 纹理宽高比
	const titleWidth = titleHeight * aspect;

	// 宽度过长则报错（正常情况不应发生）
	if (titleWidth > width) {
		throw new Error("标题宽度 " + titleWidth + " 超出面板宽度 " + width + "，请调整 titleHeight 或增大面板宽度");
	}

	const floatArray = new Float32Array(60);

	// ---- 背景矩形（6 个顶点） ----
	_setVertex(floatArray, 0, 0, 0, 0, 0, 1);
	_setVertex(floatArray, 1, width, 0, 0, 0, 1);
	_setVertex(floatArray, 2, 0, height, 0, 0, 1);
	_setVertex(floatArray, 3, 0, height, 0, 0, 1);
	_setVertex(floatArray, 4, width, 0, 0, 0, 1);
	_setVertex(floatArray, 5, width, height, 0, 0, 1);

	// ---- 文字矩形（6 个顶点） ----
	// 左下 (0,1) -> 右下 (1,1) -> 左上 (0,0) -> 右上 (1,0)
	_setVertex(floatArray, 6, titleX, titleY, 0, 1, 0);
	_setVertex(floatArray, 7, titleX + titleWidth, titleY, 1, 1, 0);
	_setVertex(floatArray, 8, titleX, titleY + titleHeight, 0, 0, 0);
	_setVertex(floatArray, 9, titleX, titleY + titleHeight, 0, 0, 0);
	_setVertex(floatArray, 10, titleX + titleWidth, titleY, 1, 1, 0);
	_setVertex(floatArray, 11, titleX + titleWidth, titleY + titleHeight, 1, 0, 0);

	return floatArray;
}
