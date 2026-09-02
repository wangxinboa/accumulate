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
 * 生成 Card 的顶点数据（背景 + 文字矩形，支持 padding 和 object-fit: contain）
 * 返回 Float32Array，每5个分量一个顶点：[x, y, u, v, isBg]
 * 共12个顶点（背景6个，文字6个），总长度 60。
 *
 * 卡牌坐标系（局部）：
 *   - 原点 (0,0) 在卡牌左上角
 *   - X 向右为正
 *   - Y 向上为正（引擎新坐标系）
 *   因此，卡牌底部边缘在 y=0，顶部边缘在 y=卡牌高度。
 *   文字矩形需要位于卡牌底部（视觉下方），所以其 Y 坐标靠近 0。
 *
 * @param {CardStoryGameType.Card} card
 * @returns {Float32Array}
 */
export function generateCardVertexData(card) {
	const cardUiConfig = card.cardUiConfig;
	const cardWidth = cardUiConfig.width;
	const cardHeight = cardUiConfig.height;

	// ---- 文字区域的整体高度（占卡牌宽度的一定比例） ----
	const titleAreaHeight = cardUiConfig.titleAreaHeight;

	// ---- 获取文字纹理的实际像素尺寸 ----
	let texWidth = 1;
	let texHeight = 1;
	if (card.titleTexture && card.titleTexture.isReady) {
		texWidth = card.titleTexture.width;
		texHeight = card.titleTexture.height;
	}

	const titleAreaPadding = cardUiConfig.titleAreaPadding;
	const titleDrawW = cardWidth - titleAreaPadding.left - titleAreaPadding.right;
	const titleDrawH = titleAreaHeight - titleAreaPadding.top - titleAreaPadding.bottom;

	let titleRectW = 0;
	let titleRectH = 0;
	let titleRectX = 0;
	let titleRectY = 0;

	const titleTextureAspect = texWidth / texHeight;
	const titleDrawAspect = titleDrawW / titleDrawH;

	if (titleDrawH > texHeight && titleDrawW > texWidth) {
		titleRectW = texWidth;
		titleRectH = texHeight;
	} else {
		if (titleDrawAspect < titleTextureAspect) {
			titleRectW = titleDrawW;
			titleRectH = titleDrawW / titleTextureAspect;
		} else {
			titleRectW = titleDrawH * titleTextureAspect;
			titleRectH = titleDrawH;
		}
	}

	titleRectX = (cardWidth - titleRectW) / 2;
	titleRectY = cardHeight - titleAreaHeight + (titleAreaHeight - titleRectH) / 2;

	// ---- 分配顶点缓冲区（12 个顶点 = 6 个背景 + 6 个文字） ----
	const floatArray = new Float32Array(60);

	// ---- 背景矩形（覆盖整个卡牌） ----
	_setVertex(floatArray, 0, 0, 0, 0, 0, 1);
	_setVertex(floatArray, 1, cardWidth, 0, 0, 0, 1);
	_setVertex(floatArray, 2, 0, cardHeight, 0, 0, 1);
	_setVertex(floatArray, 3, 0, cardHeight, 0, 0, 1);
	_setVertex(floatArray, 4, cardWidth, 0, 0, 0, 1);
	_setVertex(floatArray, 5, cardWidth, cardHeight, 0, 0, 1);

	// ---- 文字矩形（6 个顶点，纹理坐标顺序：左下(0,1) -> 右下(1,1) -> 左上(0,0) -> 右上(1,0)） ----
	_setVertex(floatArray, 6, titleRectX, titleRectY, 0, 1, 0);
	_setVertex(floatArray, 7, titleRectX + titleRectW, titleRectY, 1, 1, 0);
	_setVertex(floatArray, 8, titleRectX, titleRectY + titleRectH, 0, 0, 0);
	_setVertex(floatArray, 9, titleRectX, titleRectY + titleRectH, 0, 0, 0);
	_setVertex(floatArray, 10, titleRectX + titleRectW, titleRectY, 1, 1, 0);
	_setVertex(floatArray, 11, titleRectX + titleRectW, titleRectY + titleRectH, 1, 0, 0);

	return floatArray;
}
