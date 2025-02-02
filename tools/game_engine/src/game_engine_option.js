export const RenderType = {
	canvas: '2d',
	webgl: 'webgl',
	webgpu: 'webgpu',
}

export const FitType = {
	contain: 'contain',
	cover: 'cover',
	fill: 'fill',
}

const GameEngineOption = {
	renderType: RenderType.canvas,
	fitType: FitType.fill,

	afterRender: null,
}

export default GameEngineOption;
