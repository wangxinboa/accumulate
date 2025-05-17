// create an new instance of a pixi stage
var stage = new PIXI.Container(0x97C56E, true);

// create a renderer instance
var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);

// add the renderer view element to the DOM
renderer.view.style.position = "absolute";
renderer.view.style.top = "0px";
renderer.view.style.left = "0px";
document.body.appendChild(renderer.view);

// create a texture from an image path
var texture = PIXI.Texture.fromImage("./demos/9.TilingTexture/p2.jpeg");

// create a tiling sprite ...
// requires a texture, width and height
// to work in webGL the texture size must be a power of two
var tilingSprite = new PIXI.extras.TilingSprite(texture, window.innerWidth, window.innerHeight);
stage.addChild(tilingSprite);

var count = 0;
function animate() {
	count += 0.005;

	tilingSprite.tileScale.x = 2 + Math.sin(count);
	tilingSprite.tileScale.y = 2 + Math.cos(count);

	tilingSprite.tilePosition.x += 1;
	tilingSprite.tilePosition.y += 1;

	// render the stage
	renderer.render(stage);

	requestAnimationFrame(animate);
}

requestAnimationFrame(animate);