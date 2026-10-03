/**
 * 默认 UI 配置，作为 game_config.json 未覆盖时的回退值
 * 所有字段与 CardStoryGameType.UIConfig 对应
 */
export const defaultGameConfig = Object.freeze({
	uiConfig: {
		engineBackgroundColor: { r: 1, g: 0, b: 0, a: 1 },

		card: {
			gridCoordOffset: 10000,
			gridMaxSearchDepth: 100,
			gapX: 4,
			gapY: 4,

			gridZIndex: 1,
			panelSlotZIndex: 3,
			dragZIndex: 4,

			width: 60,
			height: 90,
			bgColor: { r: 0.2, g: 0.4, b: 0.8, a: 1 },

			titleAreaHeight: 20,
			titleAreaPadding: {
				left: 2,
				right: 2,
				top: 2,
				bottom: 2,
			},
			titleTextureOption: {
				fontSize: 16,
				fontFamily: "Microsoft YaHei",
				fontWeight: "normal",
				fontColor: "#000000",
				useFontBoundingBox: true,
			},
		},

		panel: {
			panelWidth: 300,
			panelBgColor: { r: 0.2, g: 0.2, b: 0.302, a: 0.8 },
			panelHeightRatio: 0.8,
			panelYOffset: 20,
			panelYOffsetSmall: 0.05,
			panelZIndex: 2,

			panelTitle: {
				x: 8,
				y: 4,

				height: 24,

				textureOption: {
					fontSize: 24,
					fontFamily: "Microsoft YaHei",
					fontWeight: "normal",
					fontColor: "#ffffff",
					useFontBoundingBox: true,
				},
			},

			panelDesc: {
				x: 8,
				y: 32,
				width: 284,
				height: 80,

				textureOption: {
					fontSize: 12,
					fontFamily: "math",
					fontWeight: "normal",
					fontColor: "#ffffff",
					useFontBoundingBox: false,
					maxWidth: 284,
					lineGap: 4,
				},
				scrollInvert: false,
			},

			panelButtonArea: {
				marginTop: 8,
				gapX: 8,
				gapY: 8,
				x: 8,
				width: 284,

				buttonOption: {
					padding: { left: 8, right: 8, top: 4, bottom: 4 },
					bgColor: { r: 0.3, g: 0.3, b: 0.3, a: 1 },
					selectedBgColor: { r: 0.55, g: 0.55, b: 0.55, a: 1 },
					titleTextureOption: {
						fontSize: 12,
						fontFamily: "math",
						fontWeight: "normal",
						fontColor: "#ffffff",
						useFontBoundingBox: false,
					},
				},
			},

			panelSlotArea: {
				marginTop: 12,
				x: 8,
				gapX: 6,
				gapY: 6,
				width: 284,

				slotOption: {
					width: 62,
					height: 92,
					titleTextureOption: {
						fontSize: 12,
						fontFamily: "Microsoft YaHei",
						fontWeight: "normal",
						fontColor: "#ffffff",
						useFontBoundingBox: true,
					},
					bgColor: { r: 0.1, g: 0.1, b: 0.1, a: 0.5 },
				},
			},
		},
	},
	cardTemplates: [
		// 占位卡牌：用于测试不同标题字数
		{
			id: -1,
			name: "光",
			description: "它从水面上透下来。",
		},
		{
			id: -2,
			name: "暗月",
			description: "月亮落进了水里。",
		},
		{
			id: -3,
			name: "炉火灰",
			description: "它还记得火的样子。",
		},
		{
			id: -4,
			name: "无名少女",
			description: "她看着你，一言不发。",
		},
		{
			id: -5,
			name: "水底的回声",
			description: "它比你先开口。",
		},
		{
			id: -6,
			name: "秘术师的手记",
			description: "一些字迹已经褪色。",
		},
		{
			id: -7,
			name: "沉入水底的钟摆",
			description: "它的摆动从来不合拍。",
		},
		{
			id: -8,
			name: "门扉另一侧的低语",
			description: "它一直在那里，说着你不懂的话。",
		},
		// 主角卡
		{
			id: 0,
			name: "无名者",
			description: "你在水中醒来。你不记得自己的名字。",
			actions: [{ actionId: "0", label: "供奉" }],
		},
		// 祭品卡
		{
			id: 1,
			name: "河底苔藓",
			description: "从沉船的木板上刮下的绿。它记得水的味道。",
			actions: [{ actionId: "1", label: "观察" }],
		},
		// 产出卡
		{
			id: 3,
			name: "梦中残响",
			description: "某种东西留在你身上的证明。",
			actions: [],
		},
	],
	actions: [
		{
			actionId: "0",
			label: "供 奉",
			slots: [{ label: "祭坛" }],
			conditions: [{ logic: "slotHasCard", slotIndex: 0 }],
			effects: [],
			failMessage: "祭坛空无一物。你不能向虚无献上什么。",
		},
		{
			actionId: "1",
			label: "观 察",
			conditions: [],
			effects: [],
		},
	],
	events: [],
	attributes: [],
	environmentalRules: [],
	slotGenerationRules: [],
	logicOperators: {},
});
