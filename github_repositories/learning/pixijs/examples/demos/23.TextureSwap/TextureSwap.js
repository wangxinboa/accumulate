// create an new instance of a pixi stage
var stage = new PIXI.Container(0x66FF99);

// create a renderer instance
var renderer = PIXI.autoDetectRenderer(400, 300);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

requestAnimationFrame(animate);

// create a texture from an image path
var texture = PIXI.Texture.fromImage("./demos/23.TextureSwap/flowerTop.png");
texture.baseTexture.on("loaded", function () {

	console.log(">>>>>>>");

});
// create a new Sprite using the texture
var bunny = new PIXI.Sprite(texture);

// center the sprites anchor point
bunny.anchor.x = 0.5;
bunny.anchor.y = 0.5;

// move the sprite t the center of the screen
bunny.position.x = 200;
bunny.position.y = 150;

stage.addChild(bunny);

bunny.interactive = true;
bunny.click = function () {
	texture.baseTexture.updateSourceImage("./demos/23.TextureSwap/eggHead.png");
	//console.log("FFDFDF")
};

function animate() {
	requestAnimationFrame(animate);

	// just for fun, let's rotate mr rabbit a little
	bunny.rotation += 0.1;

	// render the stage
	renderer.render(stage);
}