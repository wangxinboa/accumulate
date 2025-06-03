# AbstractRenderer

## used

1. WebGLRenderer
   > - [WebGLRenderer](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/WebGLRenderer.mjs)
   > - [WebGLRenderer.md](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/WebGLRenderer.md)

## use

### .\_systemsHash

1.  backBuffer
    > - [GlBackBufferSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/GlBackBufferSystem.mjs)
2.  background
    > - [BackgroundSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/shared/background/BackgroundSystem.mjs)
3.  view
    > - [ViewSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/shared/view/ViewSystem.mjs)
4.  renderableGC
    > - [RenderableGCSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/shared/texture/RenderableGCSystem.mjs)
5.  scheduler
    > - [SchedulerSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/shared/SchedulerSystem.mjs)
6.  globalUniforms
    > - [GlobalUniformSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/shared/renderTarget/GlobalUniformSystem.mjs)
7.  renderGroup
    > - [RenderGroupSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/scene/container/RenderGroupSystem.mjs)
8.  textureGC
    > - [TextureGCSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/shared/texture/TextureGCSystem.mjs)
9.  textureGenerator
    > - [GenerateTextureSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/shared/extract/GenerateTextureSystem.mjs)
10. extract
    > - [ExtractSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/shared/extract/ExtractSystem.mjs)
11. ubo
    > - [GlUboSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/GlUboSystem.mjs)
12. context
    > - [GlContextSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/context/GlContextSystem.mjs)
13. buffer
    > - [GlBufferSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/buffer/GlBufferSystem.mjs)
14. texture
    > - [GlTextureSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/texture/GlTextureSystem.mjs)
15. renderTarget
    > - [GlRenderTargetSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/renderTarget/GlRenderTargetSystem.mjs)
16. geometry
    > - [GlGeometrySystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/geometry/GlGeometrySystem.mjs)
17. uniformGroup
    > - [GlUniformGroupSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/shader/GlUniformGroupSystem.mjs)
18. shader
    > - [GlShaderSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/shader/GlShaderSystem.mjs)
19. encoder
    > - [GlEncoderSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/GlEncoderSystem.mjs)
20. state
    > - [GlStateSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/state/GlStateSystem.mjs)
21. stencil
    > - [GlStencilSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/GlStencilSystem.mjs)
22. colorMask
    > - [GlColorMaskSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/GlColorMaskSystem.mjs)
23. accessibility
    > - [AccessibilitySystem.mjs](/github_repositories/learning/pixijs/reproduction/src/accessibility/AccessibilitySystem.mjs)
24. events
    > - [EventSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/events/EventSystem.mjs)
25. graphicsContext
    > - [GraphicsContextSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/scene/graphics/shared/GraphicsContextSystem.mjs)
26. canvasText
    > - [CanvasTextSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/scene/text/canvas/CanvasTextSystem.mjs)
27. htmlText
    > - [HTMLTextSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/scene/text-html/HTMLTextSystem.mjs)
28. filter
    > - [FilterSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/filters/FilterSystem.mjs)
29. hello
    > - [HelloSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/shared/startup/HelloSystem.mjs)
30. initHook
    > - [globalHooks.mjs](/github_repositories/learning/pixijs/reproduction/src/utils/global/globalHooks.mjs)

### .runners

#### init

1. GlBackBufferSystem
   > - [GlBackBufferSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/GlBackBufferSystem.mjs)
2. BackgroundSystem
   > - [BackgroundSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/shared/background/BackgroundSystem.mjs)
3. ViewSystem
   > - [ViewSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/shared/view/ViewSystem.mjs)
4. RenderableGCSystem
   > - [RenderableGCSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/shared/texture/RenderableGCSystem.mjs)
5. SchedulerSystem
   > - [SchedulerSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/shared/SchedulerSystem.mjs)
6. TextureGCSystem
   > - [TextureGCSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/shared/texture/TextureGCSystem.mjs)
7. GlContextSystem
   > - [GlContextSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/context/GlContextSystem.mjs)
8. AccessibilitySystem
   > - [AccessibilitySystem.mjs](/github_repositories/learning/pixijs/reproduction/src/accessibility/AccessibilitySystem.mjs)
9. EventSystem
   > - [EventSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/events/EventSystem.mjs)
10. GraphicsContextSystem
    > - [GraphicsContextSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/scene/graphics/shared/GraphicsContextSystem.mjs)
11. HelloSystem
    > - [HelloSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/shared/startup/HelloSystem.mjs)
12. globalHooks
    > - [globalHooks.mjs](/github_repositories/learning/pixijs/reproduction/src/utils/global/globalHooks.mjs)

#### destroy

1. GlBackBufferSystem
   > - [GlBackBufferSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/GlBackBufferSystem.mjs)
2. BackgroundSystem
   > - [BackgroundSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/shared/background/BackgroundSystem.mjs)
3. ViewSystem
   > - [ViewSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/shared/view/ViewSystem.mjs)
4. RenderableGCSystem
   > - [RenderableGCSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/shared/texture/RenderableGCSystem.mjs)
5. SchedulerSystem
   > - [SchedulerSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/shared/SchedulerSystem.mjs)
6. GlobalUniformSystem
   > - [GlobalUniformSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/shared/renderTarget/GlobalUniformSystem.mjs)
7. RenderGroupSystem
   > - [RenderGroupSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/scene/container/RenderGroupSystem.mjs)
8. TextureGCSystem
   > - [TextureGCSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/shared/texture/TextureGCSystem.mjs)
9. GenerateTextureSystem
   > - [GenerateTextureSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/shared/extract/GenerateTextureSystem.mjs)
10. ExtractSystem
    > - [ExtractSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/shared/extract/ExtractSystem.mjs)
11. GlUboSystem
    > - [GlUboSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/GlUboSystem.mjs)
12. GlContextSystem
    > - [GlContextSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/context/GlContextSystem.mjs)
13. GlBufferSystem
    > - [GlBufferSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/buffer/GlBufferSystem.mjs)
14. GlTextureSystem
    > - [GlTextureSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/texture/GlTextureSystem.mjs)
15. GlRenderTargetSystem
    > - [GlRenderTargetSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/renderTarget/GlRenderTargetSystem.mjs)
16. GlGeometrySystem
    > - [GlGeometrySystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/geometry/GlGeometrySystem.mjs)
17. GlUniformGroupSystem
    > - [GlUniformGroupSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/shader/GlUniformGroupSystem.mjs)
18. GlShaderSystem
    > - [GlShaderSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/shader/GlShaderSystem.mjs)
19. GlEncoderSystem
    > - [GlEncoderSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/GlEncoderSystem.mjs)
20. GlStateSystem
    > - [GlStateSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/state/GlStateSystem.mjs)
21. AccessibilitySystem
    > - [AccessibilitySystem.mjs](/github_repositories/learning/pixijs/reproduction/src/accessibility/AccessibilitySystem.mjs)
22. EventSystem
    > - [EventSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/events/EventSystem.mjs)
23. GraphicsContextSystem
    > - [GraphicsContextSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/scene/graphics/shared/GraphicsContextSystem.mjs)
24. CanvasTextSystem
    > - [CanvasTextSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/scene/text/canvas/CanvasTextSystem.mjs)
25. HTMLTextSystem
    > - [HTMLTextSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/scene/text-html/HTMLTextSystem.mjs)
26. globalHooks
    > - [globalHooks.mjs](/github_repositories/learning/pixijs/reproduction/src/utils/global/globalHooks.mjs)

#### contextChange

1. GlContextSystem
   > - [GlContextSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/context/GlContextSystem.mjs)
2. GlBufferSystem
   > - [GlBufferSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/buffer/GlBufferSystem.mjs)
3. GlTextureSystem
   > - [GlTextureSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/texture/GlTextureSystem.mjs)
4. GlRenderTargetAdaptor
   > - [GlRenderTargetAdaptor.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/renderTarget/GlRenderTargetAdaptor.mjs)
5. GlRenderTargetSystem
   > - [GlRenderTargetSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/renderTarget/GlRenderTargetSystem.mjs)
6. GlGeometrySystem
   > - [GlGeometrySystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/geometry/GlGeometrySystem.mjs)
7. GlUniformGroupSystem
   > - [GlUniformGroupSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/shader/GlUniformGroupSystem.mjs)
8. GlShaderSystem
   > - [GlShaderSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/shader/GlShaderSystem.mjs)
9. GlStateSystem
   > - [GlStateSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/state/GlStateSystem.mjs)
10. GlStencilSystem
    > - [GlStencilSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/GlStencilSystem.mjs)
11. GlBatchAdaptor
    > - [GlBatchAdaptor.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/batcher/gl/GlBatchAdaptor.mjs)

#### resolutionChange

1. EventSystem
   > - [EventSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/events/EventSystem.mjs)
2. CanvasTextPipe
   > - [CanvasTextPipe.mjs](/github_repositories/learning/pixijs/reproduction/src/scene/text/canvas/CanvasTextPipe.mjs)
3. HTMLTextPipe
   > - [HTMLTextPipe.mjs](/github_repositories/learning/pixijs/reproduction/src/scene/text-html/HTMLTextPipe.mjs)

#### resetState

1. GlBufferSystem
   > - [GlBufferSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/buffer/GlBufferSystem.mjs)
2. GlTextureSystem
   > - [GlTextureSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/texture/GlTextureSystem.mjs)
3. GlRenderTargetSystem
   > - [GlRenderTargetSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/renderTarget/GlRenderTargetSystem.mjs)
4. GlGeometrySystem
   > - [GlGeometrySystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/geometry/GlGeometrySystem.mjs)
5. GlShaderSystem
   > - [GlShaderSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/shader/GlShaderSystem.mjs)
6. GlStateSystem
   > - [GlStateSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/state/GlStateSystem.mjs)
7. GlStencilSystem
   > - [GlStencilSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/GlStencilSystem.mjs)

#### renderEnd

1. GlBackBufferSystem
   > - [GlBackBufferSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/GlBackBufferSystem.mjs)

#### renderStart

1. GlBackBufferSystem
   > - [GlBackBufferSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/GlBackBufferSystem.mjs)
2. GlRenderTargetSystem
   > - [GlRenderTargetSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/renderTarget/GlRenderTargetSystem.mjs)

#### render

1. RenderGroupSystem
   > - [RenderGroupSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/scene/container/RenderGroupSystem.mjs)

#### update

#### postrender

1. TextureGCSystem
   > - [TextureGCSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/shared/texture/TextureGCSystem.mjs)
2. GlRenderTargetSystem
   > - [GlRenderTargetSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/gl/renderTarget/GlRenderTargetSystem.mjs)
3. AccessibilitySystem
   > - [AccessibilitySystem.mjs](/github_repositories/learning/pixijs/reproduction/src/accessibility/AccessibilitySystem.mjs)
4. DOMPipe
   > - [DOMPipe.mjs](/github_repositories/learning/pixijs/reproduction/src/dom/DOMPipe.mjs)

#### prerender

1. RenderableGCSystem
   > - [RenderableGCSystem.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/shared/texture/RenderableGCSystem.mjs)
2. BlendModePipe
   > - [BlendModePipe.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/shared/blendModes/BlendModePipe.mjs)

### .renderPipes

1. blendMode
   > - [BlendModePipe.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/shared/blendModes/BlendModePipe.mjs)
2. batch
   > - [BatcherPipe.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/batcher/shared/BatcherPipe.mjs)
3. sprite
   > - [SpritePipe.mjs](/github_repositories/learning/pixijs/reproduction/src/scene/sprite/SpritePipe.mjs)
4. renderGroup
   > - [RenderGroupPipe.mjs](/github_repositories/learning/pixijs/reproduction/src/scene/container/RenderGroupPipe.mjs)
5. alphaMask
   > - [AlphaMaskPipe.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/mask/alpha/AlphaMaskPipe.mjs)
6. stencilMask
   > - [StencilMaskPipe.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/mask/stencil/StencilMaskPipe.mjs)
7. colorMask
   > - [ColorMaskPipe.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/mask/color/ColorMaskPipe.mjs)
8. customRender
   > - [CustomRenderPipe.mjs](/github_repositories/learning/pixijs/reproduction/src/scene/container/CustomRenderPipe.mjs)
9. dom
   > - [DOMPipe.mjs](/github_repositories/learning/pixijs/reproduction/src/dom/DOMPipe.mjs)
10. graphics
    > - [GraphicsPipe.mjs](/github_repositories/learning/pixijs/reproduction/src/scene/graphics/shared/GraphicsPipe.mjs)
11. mesh
    > - [MeshPipe.mjs](/github_repositories/learning/pixijs/reproduction/src/scene/mesh/shared/MeshPipe.mjs)
12. particle
    > - [particle](/github_repositories/learning/pixijs/reproduction/src/scene/particle-container/shared/GlParticleContainerPipe.mjs)
13. text
    > - [CanvasTextPipe.mjs](/github_repositories/learning/pixijs/reproduction/src/scene/text/canvas/CanvasTextPipe.mjs)
14. bitmapText
    > - [BitmapTextPipe.mjs](/github_repositories/learning/pixijs/reproduction/src/scene/text-bitmap/BitmapTextPipe.mjs)
15. htmlText
    > - [HTMLTextPipe.mjs](/github_repositories/learning/pixijs/reproduction/src/scene/text-html/HTMLTextPipe.mjs)
16. tilingSprite
    > - [TilingSpritePipe.mjs](/github_repositories/learning/pixijs/reproduction/src/scene/sprite-tiling/TilingSpritePipe.mjs)
17. nineSliceSprite
    > - [NineSliceSpritePipe.mjs](/github_repositories/learning/pixijs/reproduction/src/scene/sprite-nine-slice/NineSliceSpritePipe.mjs)
18. filter
    > - [FilterPipe.mjs](/github_repositories/learning/pixijs/reproduction/src/filters/FilterPipe.mjs)

### renderPipes.adaptor

1. batch.adaptor
   > - [GlBatchAdaptor.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/batcher/gl/GlBatchAdaptor.mjs)
2. graphics.adaptor
   > - [GlGraphicsAdaptor.mjs](/github_repositories/learning/pixijs/reproduction/src/scene/graphics/gl/GlGraphicsAdaptor.mjs)
3. mesh.adaptor
   > - [GlMeshAdaptor.mjs](/github_repositories/learning/pixijs/reproduction/src/scene/mesh/gl/GlMeshAdaptor.mjs)
