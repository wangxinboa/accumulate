/**
 * 默认 UI 配置，作为 game_config.json 未覆盖时的回退值
 * 所有字段与 CardStoryGameType.UIConfig 对应
 */
export const defaultGameConfig = Object.freeze({
	uiConfig: {
		engineBackgroundColor: { r: 1, g: 0, b: 0, a: 1 },

		card: {
			padding: {
				left: 4,
				right: 4,
				top: 3,
				bottom: 0,
			},
			width: 60,
			height: 90,
			bgColor: { r: 0.2, g: 0.4, b: 0.8, a: 1 },
			textColor: { r: 0, g: 0, b: 0, a: 1 },
			fontSize: 16,
			fontFamily: "math",
			textHeightRatio: 0.333,

			gridCoordOffset: 10000,
			gridMaxSearchDepth: 100,
			gapX: 4,
			gapY: 4,

			cardZIndex: 10,
		},

		panel: {
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
				height: 80,
			},
			descriptionFontSize: 12,

			panelZIndex: 1000,

			scrollInvert: false,

			// 按钮相关
			buttonPadding: { left: 8, right: 8, top: 4, bottom: 4 },
			buttonGapX: 8,
			buttonGapY: 8,
			buttonMarginTop: 8,
			buttonHeight: 30,
			buttonGap: 8,
			buttonBgColor: { r: 0.3, g: 0.3, b: 0.3, a: 1 },
			buttonTextColor: { r: 1, g: 1, b: 1, a: 1 },
			buttonFontSize: 16,
			buttonFontFamily: "math",
		},
	},
});
