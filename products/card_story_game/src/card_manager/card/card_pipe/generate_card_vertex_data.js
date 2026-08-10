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
	const cardWidth = card.width;
	const cardHeight = card.height;
	const cardUiConfig = card.game.gameConfig.uiConfig.card;

	// ---- 文字区域的整体高度（占卡牌宽度的一定比例） ----
	const textAreaHeight = cardWidth * cardUiConfig.textHeightRatio;

	// ---- 获取文字纹理的实际像素尺寸 ----
	let texWidth = 1;
	let texHeight = 1;
	if (card.textTexture && card.textTexture.isReady) {
		texWidth = card.textTexture.width;
		texHeight = card.textTexture.height;
	}
	const textureAspect = texWidth / texHeight;

	// ---- 在文字区域内，对纹理进行 contain 缩放 ----
	const areaAspect = cardWidth / textAreaHeight;
	let drawWidth, drawHeight;
	if (textureAspect > areaAspect) {
		drawWidth = cardWidth;
		drawHeight = cardWidth / textureAspect;
	} else {
		drawHeight = textAreaHeight;
		drawWidth = textAreaHeight * textureAspect;
	}
	const offsetX = (cardWidth - drawWidth) / 2;
	const offsetY = (textAreaHeight - drawHeight) / 2;

	// ---- 应用内边距 ----
	const padding = cardUiConfig.padding;
	const contentX = offsetX + padding.left;
	const contentY = offsetY + padding.top;
	const contentWidth = drawWidth - padding.left - padding.right;
	const contentHeight = drawHeight - padding.top - padding.bottom;

	// ---- 在内容区域内再次按 contain 缩放并居中 ----
	let textRectX = contentX;
	let textRectY = contentY;
	let textRectW = contentWidth;
	let textRectH = contentHeight;

	if (contentWidth > 0 && contentHeight > 0) {
		const contentAspect = contentWidth / contentHeight;
		if (textureAspect > contentAspect) {
			textRectW = contentWidth;
			textRectH = contentWidth / textureAspect;
		} else {
			textRectH = contentHeight;
			textRectW = contentHeight * textureAspect;
		}
		textRectX = contentX + (contentWidth - textRectW) / 2;
		textRectY = contentY + (contentHeight - textRectH) / 2;
	} else {
		// 内容区域无效，退化为不可见
		textRectW = 0;
		textRectH = 0;
		textRectX = offsetX;
		textRectY = offsetY;
	}

	// ---- 关键：Y 轴翻转以适应新坐标系（原点在左上，Y 向上） ----
	// 在旧坐标系（Y 向下）中，文字位于底部（Y 值大）；现在 Y 向上，底部对应 Y=0。
	// 因此将文字矩形的 Y 坐标镜像翻转：底部对齐卡牌底部（Y=0），顶部向上延伸。
	// 翻转公式：新Y = cardHeight - (旧Y + 旧H)
	textRectY = cardHeight - (textRectY + textRectH);
	// 注意：textRectH 不变，因为高度方向没有变化（只是 Y 起点变了）

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
	_setVertex(floatArray, 6, textRectX, textRectY, 0, 1, 0);
	_setVertex(floatArray, 7, textRectX + textRectW, textRectY, 1, 1, 0);
	_setVertex(floatArray, 8, textRectX, textRectY + textRectH, 0, 0, 0);
	_setVertex(floatArray, 9, textRectX, textRectY + textRectH, 0, 0, 0);
	_setVertex(floatArray, 10, textRectX + textRectW, textRectY, 1, 1, 0);
	_setVertex(floatArray, 11, textRectX + textRectW, textRectY + textRectH, 1, 0, 0);

	return floatArray;
}
