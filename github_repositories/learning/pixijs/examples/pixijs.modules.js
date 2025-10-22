import { browserExt } from "../src/environment-browser/browserExt.mjs";
import { webworkerExt } from "../src/environment-webworker/webworkerExt.mjs";
import { extensions } from "../src/extensions/Extensions.mjs";

extensions.add(browserExt, webworkerExt);

// 对照源码
import("../examples/src/scene/sprite/sprite.js");

// old example

// import './demos/1.Basics/Basics.js';
// import './demos/2.SpriteSheet/SpriteSheet.js';
// 未兼容
// import './demos/2.SpriteSheet/SpriteSheetTrim.js';
// import './demos/3.MovieClip/MovieClip.js';

// import './demos/4.Balls/Balls.js';
// import './demos/5.Morph/Morph.js';
// import './demos/6.Interactivity/Interactivity.js';
// import './demos/7.TransparentBackground/TransparentBackground.js';
// 未兼容
// import './demos/9.TilingTexture/TilingTexture.js';

// import './demos/10.Text/Text.js';
// import './demos/11.RenderTexture/RenderTexture.js';
// 未兼容
// import './demos/12.Spine/Dragon.js';
// import './demos/12.Spine/Goblins.js';
// import './demos/12.Spine/Pixie.js';
// import './demos/12.Spine/Spine.js';

// import './demos/13.Graphics/Graphics.js';
// import './demos/13.Graphics/GraphicsLineTest.js';
// import './demos/14.Masking/CopyIndex.js';
// import './demos/14.Masking/IndexDoubleMask.js';
// import './demos/14.Masking/IndexNestedMasks.js';
// import './demos/14.Masking/Masking.js';
// 未兼容
// import './demos/15.Filters/Filters.js';
// import './demos/15.Filters/FiltersAll.js';
// import './demos/15.Filters/FiltersBlur.js';
// import './demos/15.Filters/FiltersDisplacement_2.js';
// import './demos/15.Filters/FiltersDisplacement.js';

// import './demos/16.BlendModes/BlendModes.js';
// import './demos/17.Tinting/Tinting.js';
// 未兼容
// import './demos/18.Batch/Batch.js';
// import './demos/19.CacheAsBitmap/CacheAsBitmap.js';
// import './demos/20.Strip/Strip.js';

// import './demos/21.ComplexGraphics/ComplexGraphics.js';
// import './demos/22.ComplexMasking/ComplexMasking.js';

// 未兼容
// import './demos/23.TextureSwap/TextureSwap.js';
// import './demos/24.Video/Video.js';

// 对照源码
// import '../examples/src/core/graphics/graphics_line_test.js';
// import '../examples/src/core/graphics/graphics.js';
// import '../examples/src/core/renderer/webgl/filters/filter.js';// 框架相关功能未完善
// import '../examples/src/core/sprites/sprite.js';
// import '../examples/src/core/text/text.js';
// import '../examples/src/core/textures/render_texture.js';
// import '../examples/src/core/textures/video_base_texture.js';// 框架有 bug
// import '../examples/src/extract/extract.js';// 框架相关功能未完善
// import '../examples/src/extras/animated_sprite.js';// 待完善
// import '../examples/src/extras/bitmap.js';
// import '../examples/src/extras/tiling_sprite.js';// 框架有 bug
// import '../examples/src/interaction/interaction.js'
// import '../examples/src/mesh/rope.js';// 框架相关功能未完善
// import '../examples/src/particles/particles.js';// 框架相关功能未完善
