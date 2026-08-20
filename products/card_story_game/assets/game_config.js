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

			cardZIndex: 10,
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
			panelZIndex: 1000,

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
					titleTextureOption: {
						fontSize: 12,
						fontFamily: "math",
						fontWeight: "normal",
						fontColor: "#ffffff",
						useFontBoundingBox: false,
					},
				},
			},
		},
	},
	cardTemplates: [
		{
			id: -1,
			name: "一",
			description: "测试标题一个字",
		},
		{
			id: -2,
			name: "一二",
			description: "测试标题二个字",
		},
		{
			id: -3,
			name: "一二三",
			description: "测试标题三个字",
		},
		{
			id: -4,
			name: "一二三四",
			description: "测试标题四个字",
		},
		{
			id: -5,
			name: "一二三四五",
			description: "测试标题五个字",
		},
		{
			id: -6,
			name: "一二三四五六",
			description: "测试标题六个字",
		},
		{
			id: -7,
			name: "一二三四五六七",
			description: "测试标题七个字",
		},
		{
			id: -8,
			name: "一二三四五六七八",
			description: "测试标题八个字",
		},
		{
			id: 0,
			name: "育幼院的孩子",
			description: "测试描述信息1",
			actions: ["1"],
		},
		{
			id: 1,
			name: "育幼院",
			description:
				"测试描述信息11测试描述信息22测试描述信息33测试描述信息44测试描述信息55测试描述信息66测试描述信息77测试描述信息88测试描述信息99测试描述信息1010啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊1111111111111111\n测试描述信息11测试描述信息22测试描述信息33测试描述信息44测试描述信息55测试描述信息66测试描述信息77测试描述信息88测试描述信息99测试描述信息1010啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊1111111111111111\n测试描述信息11测试描述信息22测试描述信息33测试描述信息44测试描述信息55测试描述信息66测试描述信息77测试描述信息88测试描述信息99测试描述信息1010啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊1111111111111111",
			actions: [
				{
					actionId: "0",
					label: "检 测",
				},
				{
					actionId: "1",
					label: "测 试",
				},
				{
					actionId: "2",
					label: "测 试",
				},
				{
					actionId: "3",
					label: "测 试",
				},
				{
					actionId: "4",
					label: "测 试",
				},
				{
					actionId: "5",
					label: "测 试",
				},
				{
					actionId: "6",
					label: "测 试",
				},
				{
					actionId: "7",
					label: "测 试",
				},
				{
					actionId: "8",
					label: "测 试",
				},
				{
					actionId: "9",
					label: "测 试",
				},
				{
					actionId: "10",
					label: "测 试",
				},
			],
		},
	],
	actions: [
		{
			actionId: "0",
			label: "检 测",
			effect: "0",
		},
		{
			actionId: "1",
			label: "测 试",
			effect: "0",
		},
		{
			actionId: "2",
			label: "测 试",
			effect: "0",
		},
		{
			actionId: "3",
			label: "测 试",
			effect: "0",
		},
		{
			actionId: "4",
			label: "测 试",
			effect: "0",
		},
		{
			actionId: "5",
			label: "测 试",
			effect: "0",
		},
		{
			actionId: "6",
			label: "测 试",
			effect: "0",
		},
		{
			actionId: "7",
			label: "测 试",
			effect: "0",
		},
		{
			actionId: "8",
			label: "测 试",
			effect: "0",
		},
		{
			actionId: "9",
			label: "测 试",
			effect: "0",
		},
		{
			actionId: "10",
			label: "测 试",
			effect: "0",
		},
	],
	events: [],
	attributes: [],
	environmentalRules: [],
	slotGenerationRules: [],
	logicOperators: {},
});
