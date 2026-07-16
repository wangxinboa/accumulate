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
 * 生成 BaseCard 的顶点数据（背景 + 文字矩形，支持 padding 和 object-fit: contain）
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
	const aspect = texWidth / texHeight;

	// ---- 原始文字矩形（未加 padding）的 contain 计算 ----
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

	// ---- 读取 padding（默认值为 0） ----
	const padLeft = 2;
	const padRight = 2;
	const padTop = 0;
	const padBottom = 0;

	// ---- 应用 padding 后的内容区域 ----
	const contentX = offsetX + padLeft;
	const contentY = offsetY + padTop;
	const contentWidth = drawWidth - padLeft - padRight;
	const contentHeight = drawHeight - padTop - padBottom;

	// ---- 在内容区域内按 contain 缩放并居中 ----
	let finalX = contentX;
	let finalY = contentY;
	let finalW = contentWidth;
	let finalH = contentHeight;

	if (contentWidth > 0 && contentHeight > 0) {
		const contentAspect = contentWidth / contentHeight;
		if (aspect > contentAspect) {
			// 宽度受限，高度按比例
			finalW = contentWidth;
			finalH = contentWidth / aspect;
		} else {
			// 高度受限，宽度按比例
			finalH = contentHeight;
			finalW = contentHeight * aspect;
		}
		finalX = contentX + (contentWidth - finalW) / 2;
		finalY = contentY + (contentHeight - finalH) / 2;
	} else {
		// 内容区域无效（padding 过大），退化为不可见（尺寸为0）
		finalW = 0;
		finalH = 0;
		// 位置保持在偏移起始点，不影响其他顶点
		finalX = offsetX;
		finalY = offsetY;
	}

	// ---- 分配顶点缓冲区 ----
	const floatArray = new Float32Array(60);

	// ---- 背景矩形（6 个顶点） ----
	_setVertex(floatArray, 0, 0, 0, 0, 0, 1);
	_setVertex(floatArray, 1, width, 0, 0, 0, 1);
	_setVertex(floatArray, 2, 0, height, 0, 0, 1);
	_setVertex(floatArray, 3, 0, height, 0, 0, 1);
	_setVertex(floatArray, 4, width, 0, 0, 0, 1);
	_setVertex(floatArray, 5, width, height, 0, 0, 1);

	// ---- 文字矩形（6 个顶点） ----
	// 纹理坐标顺序：左下(0,1) -> 右下(1,1) -> 左上(0,0) -> 右上(1,0)
	_setVertex(floatArray, 6, finalX, finalY, 0, 1, 0);
	_setVertex(floatArray, 7, finalX + finalW, finalY, 1, 1, 0);
	_setVertex(floatArray, 8, finalX, finalY + finalH, 0, 0, 0);
	_setVertex(floatArray, 9, finalX, finalY + finalH, 0, 0, 0);
	_setVertex(floatArray, 10, finalX + finalW, finalY, 1, 1, 0);
	_setVertex(floatArray, 11, finalX + finalW, finalY + finalH, 1, 0, 0);

	return floatArray;
}
