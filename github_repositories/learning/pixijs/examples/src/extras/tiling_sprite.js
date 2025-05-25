// 需要在 TilingSpriteRenderer 中调整代码，不然会报错，属于框架本身的 bug
const app = new PIXI.Application({
	width: window.innerWidth,
	height: window.innerHeight,
});
// create an new instance of a pixi stage
var stage = app.stage;

// add the renderer view element to the DOM
document.body.appendChild(app.renderer.view);


var texture = PIXI.Texture.fromImage("./assets/p2.jpeg");
// create a tiling sprite ...
// requires a texture, width and height
// to work in webGL the texture size must be a power of two
var tilingSprite = new PIXI.extras.TilingSprite(texture, window.innerWidth, window.innerHeight);
stage.addChild(tilingSprite);

var count = 0;
app.ticker.add(() => {
	count += 0.005;

	tilingSprite.tileScale.x = 2 + Math.sin(count);
	tilingSprite.tileScale.y = 2 + Math.cos(count);

	tilingSprite.tilePosition.x += 1;
	tilingSprite.tilePosition.y += 1;
});