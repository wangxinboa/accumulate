export const InstructionTypeEnum = Object.freeze({
	// ========================
	// 卡牌生命周期
	// ========================

	/** 创建一张或多张卡牌。params: templateId, gridX?, gridY?, amount? */
	createCard: "createCard",
	/** 从场景中移除一张卡牌（回收进对象池）。params: card */
	removeCard: "removeCard",

	// ========================
	// 卡牌面板
	// ========================

	/** 打开卡牌面板并展示指定卡牌。params: card */
	openCardPanel: "openCardPanel",
	/** 关闭卡牌面板。params: 无 */
	closeCardPanel: "closeCardPanel",
	/** 选择卡牌面板上指定 actionId 的按钮（等价于点击它）。params: actionId */
	selectCardPanelButton: "selectCardPanelButton",
});
