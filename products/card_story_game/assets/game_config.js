/**
 * 默认 UI 配置，作为 game_config.json 未覆盖时的回退值
 * 所有字段与 CardStoryGameType.UIConfig 对应
 */
export const defaultGameConfig = {
	uiConfig: {
		cardPadding: {
			left: 4,
			right: 4,
			top: 3,
			bottom: 0,
		},
		cardWidth: 60,
		cardHeight: 90,
		cardGapX: 4,
		cardGapY: 4,
		cardBgColor: { r: 0.2, g: 0.4, b: 0.8, a: 1 },
		cardTextColor: { r: 0, g: 0, b: 0, a: 1 },
		cardFontSize: 16,
		cardFontFamily: "math",
		cardTextHeightRatio: 0.333,

		panelWidth: 300,
		panelBgColor: { r: 0.2, g: 0.2, b: 0.302, a: 0.8 },
		panelTextColor: { r: 1, g: 1, b: 1, a: 1 },
		panelTitleHeight: 24,
		panelTitleX: 8,
		panelTitleY: 8,
		panelTitleFontSize: 24,
		panelTitleFontFamily: "math",
		panelDescFontSize: 12,
		panelDescFontFamily: "math",
		panelHeightRatio: 0.8,
		panelYOffset: 20,
		panelYOffsetSmall: 0.05,

		descriptionRect: {
			x: 8,
			y: 32,
			width: 284,
			height: 60,
		},
		descriptionFontSize: 12,

		engineBackgroundColor: { r: 1, g: 0, b: 0, a: 1 },

		gridCoordOffset: 10000,
		gridMaxSearchDepth: 100,
		cardZIndex: 10,
		panelZIndex: 1000,

		scrollInvert: false,
	},
};
