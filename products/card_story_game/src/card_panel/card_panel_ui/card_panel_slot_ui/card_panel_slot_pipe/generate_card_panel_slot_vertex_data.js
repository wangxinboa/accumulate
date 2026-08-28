/**
 * 生成 CardPanelSlot 的顶点数据（纯色矩形背景）
 * 坐标：矩形左下角为原点，Y 向上
 * @param {CardStoryGameType.CardPanelSlot} cardPanelSlot
 * @returns {Float32Array}
 */
export function generateCardPanelSlotVertexData(cardPanelSlot) {
	const width = cardPanelSlot.width;
	const height = cardPanelSlot.height;

	// 6 个顶点（两个三角形构成矩形）
	const floatArray = new Float32Array(12);

	// 三角形1：左下、右下、左上
	floatArray[0] = 0;
	floatArray[1] = 0;
	floatArray[2] = width;
	floatArray[3] = 0;
	floatArray[4] = 0;
	floatArray[5] = height;

	// 三角形2：左上、右下、右上
	floatArray[6] = 0;
	floatArray[7] = height;
	floatArray[8] = width;
	floatArray[9] = 0;
	floatArray[10] = width;
	floatArray[11] = height;

	return floatArray;
}
