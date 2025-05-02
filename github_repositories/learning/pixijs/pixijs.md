# pixijs

## git 链接
[https://github.com/pixijs/pixijs](https://github.com/pixijs/pixijs)

## 简介
HTML5 创作引擎: 使用最快、最灵活的 2D WebGL 渲染器，创作出精美的数字内容。

## 引用仓库源码
1. 在服务器根目录中添加 pixijs , 并将源码版本调至 a40a1e2312ebd19ac98727afedc6dcbe3c53d676

<!--
	目标下一个版本
		30cbee81c2927930611bb9f05b01bf95e52cbc50: 2013/6/20 v1.2.0
		075e2fc2e7897fe45cf17cc020b75d0f9edda1c5: 2013/8/19 v1.3.0
		31e05f6f5335f529339f9912a975687a4a42f61a: 2014/1/6  v1.4.0
		// 正在看
		a40a1e2312ebd19ac98727afedc6dcbe3c53d676: 2014/12/2 version update to 2.2
		// 准备看
		962f5bdff1ed2d96cfeaef22897ed83b7cce79bd: 2015/12/23 v3.0.9
		ac95866581c66d924924d1438dec775181e50884: 2016/9/21 v4.0.2
		479e68a8c8a96d080129b00c15430a867c69dc0f: 2017/6/2 v5.0.0-alpha
		101f51a756db856f004b1522b07006026465d194: 2018/7/3 v5.0.0-alpha.3
		9026a1bbca9a9d86b7a3b6d5eb4fa2c3145c2b85: 2019/2/1 v5.0.0-rc
		aaf96b460582b83a1fa73037ef2dd69dd9e84415: 2019/11/6 v5.2.0
		15513755f4d9f2112df5cc261b44f2dc1f05e00c: 2020/12/30 v6.0.0-rc
		793f21c0d0f2d2a423bd4339f40a569e1ea68711: 2021/11/2 v6.2.0
		4079e92895ecb692afe9f0b15d3e48ee40852ada: 2023/1/11 v7.1.0
		3f979f3cef260b6b13dc0c5a12c65edd27e81e00: 2023/12/5 v8.0.0-beta.12
		6f453df5e78fec090294eb57649a8aa9cbdc3825: 2024/12/18 v8.6.6
		9d177e2d2d3c33df2b0ae7afef180c5028e4d3af: 2025/3/27 v8.9.1
-->

2. 在案例源码中添加以下引用需要 js 代码引用
```
	<script defer type="text/javascript" src="/pixijs/src/pixi/Pixi.js"></script>

	<script defer type="text/javascript" src="/pixijs/src/pixi/utils/Detector.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/utils/EventTarget.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/utils/Polyk.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/utils/Utils.js"></script>

	<script defer type="text/javascript" src="/pixijs/src/pixi/geom/Circle.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/geom/Ellipse.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/geom/Matrix.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/geom/Point.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/geom/Polygon.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/geom/Rectangle.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/geom/RoundedRectangle.js"></script>

	<script defer type="text/javascript" src="/pixijs/src/pixi/InteractionData.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/InteractionManager.js"></script>
	<!-- <script defer type="text/javascript" src="/pixijs/src/pixi/Intro.js"></script> -->
	<!-- <script defer type="text/javascript" src="/pixijs/src/pixi/Outro.js"></script> -->

	<script defer type="text/javascript" src="/pixijs/src/pixi/display/DisplayObject.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/display/DisplayObjectContainer.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/display/Sprite.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/display/MovieClip.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/display/SpriteBatch.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/display/Stage.js"></script>

	<script defer type="text/javascript" src="/pixijs/src/pixi/extras/Spine.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/extras/PIXISpine.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/extras/Strip.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/extras/Rope.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/extras/TilingSprite.js"></script>

	<script defer type="text/javascript" src="/pixijs/src/pixi/filters/AbstractFilter.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/filters/AlphaMaskFilter.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/filters/AsciiFilter.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/filters/BlurFilter.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/filters/BlurXFilter.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/filters/BlurYFilter.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/filters/ColorMatrixFilter.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/filters/ColorStepFilter.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/filters/ConvolutionFilter.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/filters/CrossHatchFilter.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/filters/DisplacementFilter.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/filters/DotScreenFilter.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/filters/FilterBlock.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/filters/GrayFilter.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/filters/InvertFilter.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/filters/NoiseFilter.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/filters/NormalMapFilter.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/filters/PixelateFilter.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/filters/RGBSplitFilter.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/filters/SepiaFilter.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/filters/SmartBlurFilter.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/filters/TiltShiftFilter.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/filters/TiltShiftXFilter.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/filters/TiltShiftYFilter.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/filters/TwistFilter.js"></script>

	<script defer type="text/javascript" src="/pixijs/src/pixi/loaders/AssetLoader.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/loaders/AtlasLoader.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/loaders/BitmapFontLoader.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/loaders/ImageLoader.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/loaders/JsonLoader.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/loaders/SpineLoader.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/loaders/SpriteSheetLoader.js"></script>

	<script defer type="text/javascript" src="/pixijs/src/pixi/primitives/Graphics.js"></script>

	<script defer type="text/javascript" src="/pixijs/src/pixi/renderers/canvas/CanvasGraphics.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/renderers/canvas/CanvasRenderer.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/renderers/canvas/utils/CanvasBuffer.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/renderers/canvas/utils/CanvasMaskManager.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/renderers/canvas/utils/CanvasTinter.js"></script>

	<script defer type="text/javascript" src="/pixijs/src/pixi/renderers/webgl/WebGLRenderer.js"></script>
	<script defer type="text/javascript"
		src="/pixijs/src/pixi/renderers/webgl/shaders/ComplexPrimitiveShader.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/renderers/webgl/shaders/PixiFastShader.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/renderers/webgl/shaders/PixiShader.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/renderers/webgl/shaders/PrimitiveShader.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/renderers/webgl/shaders/StripShader.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/renderers/webgl/utils/FilterTexture.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/renderers/webgl/utils/WebGLBlendModeManager.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/renderers/webgl/utils/WebGLFastSpriteBatch.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/renderers/webgl/utils/WebGLFilterManager.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/renderers/webgl/utils/WebGLGraphics.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/renderers/webgl/utils/WebGLMaskManager.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/renderers/webgl/utils/WebGLShaderManager.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/renderers/webgl/utils/WebGLShaderUtils.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/renderers/webgl/utils/WebGLSpriteBatch.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/renderers/webgl/utils/WebGLStencilManager.js"></script>

	<script defer type="text/javascript" src="/pixijs/src/pixi/text/BitmapText.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/text/Text.js"></script>

	<script defer type="text/javascript" src="/pixijs/src/pixi/textures/BaseTexture.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/textures/Texture.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/textures/RenderTexture.js"></script>
	<script defer type="text/javascript" src="/pixijs/src/pixi/textures/VideoTexture.js"></script>
```

3. 直接在服务器访问相关案例，或者调用 PIXI 实现案例效果
