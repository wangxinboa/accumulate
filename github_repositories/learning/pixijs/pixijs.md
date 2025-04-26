# pixijs

## git 链接
[https://github.com/pixijs/pixijs](https://github.com/pixijs/pixijs)

## 简介
HTML5 创作引擎: 使用最快、最灵活的 2D WebGL 渲染器，创作出精美的数字内容。

## 引用仓库源码
1. 在服务器根目录中添加 pixijs , 并将源码版本调至 30cbee81c2927930611bb9f05b01bf95e52cbc50

2. 在案例源码中添加以下引用需要 js 代码引用
```
<!-- <script src="/pixijs/bin/pixi.js"></script> -->

<script defer type="text/javascript" src="/pixijs/src/pixi/Pixi.js"></script>

<script defer type="text/javascript" src="/pixijs/src/pixi/utils/Detector.js"></script>
<script defer type="text/javascript" src="/pixijs/src/pixi/utils/EventTarget.js"></script>
<script defer type="text/javascript" src="/pixijs/src/pixi/utils/Matrix.js"></script>
<script defer type="text/javascript" src="/pixijs/src/pixi/utils/Utils.js"></script>

<script defer type="text/javascript" src="/pixijs/src/pixi/Rectangle.js"></script>
<script defer type="text/javascript" src="/pixijs/src/pixi/DisplayObject.js"></script>
<script defer type="text/javascript" src="/pixijs/src/pixi/DisplayObjectContainer.js"></script>

<!-- <script defer type="text/javascript" src="/pixijs/src/pixi/Intro.js"></script> -->
<script defer type="text/javascript" src="/pixijs/src/pixi/Sprite.js"></script>
<script defer type="text/javascript" src="/pixijs/src/pixi/MovieClip.js"></script>
<!-- <script defer type="text/javascript" src="/pixijs/src/pixi/Outro.js"></script> -->
<script defer type="text/javascript" src="/pixijs/src/pixi/Point.js"></script>
<script defer type="text/javascript" src="/pixijs/src/pixi/Stage.js"></script>
<script defer type="text/javascript" src="/pixijs/src/pixi/InteractionManager.js"></script>
<script defer type="text/javascript" src="/pixijs/src/pixi/Polygon.js"></script>

<script defer type="text/javascript" src="/pixijs/src//pixi/extras/Spine.js"></script>
<script defer type="text/javascript" src="/pixijs/src/pixi/extras/CustomRenderable.js"></script>
<script defer type="text/javascript" src="/pixijs/src/pixi/extras/Strip.js"></script>
<script defer type="text/javascript" src="/pixijs/src/pixi/extras/Rope.js"></script>
<script defer type="text/javascript" src="/pixijs/src/pixi/extras/TilingSprite.js"></script>

<script defer type="text/javascript" src="/pixijs/src/pixi/loaders/AssetLoader.js"></script>
<script defer type="text/javascript" src="/pixijs/src/pixi/loaders/BitmapFontLoader.js"></script>
<script defer type="text/javascript" src="/pixijs/src/pixi/loaders/ImageLoader.js"></script>
<script defer type="text/javascript" src="/pixijs/src/pixi/loaders/JsonLoader.js"></script>
<script defer type="text/javascript" src="/pixijs/src/pixi/loaders/SpineLoader.js"></script>
<script defer type="text/javascript" src="/pixijs/src/pixi/loaders/SpriteSheetLoader.js"></script>

<!-- <script defer type="text/javascript" src="/pixijs/src/pixi/primitives/Graphics.js"></script> -->
<!-- <script defer type="text/javascript" src="/pixijs/src/pixi/primitives/Line.js"></script> -->

<script defer type="text/javascript" src="/pixijs/src/pixi/renderers/CanvasRenderer.js"></script>
<script defer type="text/javascript" src="/pixijs/src/pixi/renderers/WebGLRenderer.js"></script>
<script defer type="text/javascript" src="/pixijs/src/pixi/renderers/WebGLBatch.js"></script>
<script defer type="text/javascript" src="/pixijs/src/pixi/renderers/WebGLShaders.js"></script>
<script defer type="text/javascript" src="/pixijs/src/pixi/renderers/WebGLRenderGroup.js"></script>

<script defer type="text/javascript" src="/pixijs/src/pixi/text/BitmapText.js"></script>
<script defer type="text/javascript" src="/pixijs/src/pixi/text/Text.js"></script>

<script defer type="text/javascript" src="/pixijs/src/pixi/textures/BaseTexture.js"></script>
<script defer type="text/javascript" src="/pixijs/src/pixi/textures/Texture.js"></script>
<script defer type="text/javascript" src="/pixijs/src/pixi/textures/RenderTexture.js"></script>
```

3. 直接在服务器访问相关案例，或者调用 PIXI 实现案例效果
