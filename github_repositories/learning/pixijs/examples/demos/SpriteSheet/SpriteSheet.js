// create an array of assets to load
var assetsToLoader = ["./demos/SpriteSheet/SpriteSheet.json"];

// create a new loader
var loader = new PIXI.AssetLoader(assetsToLoader);

// use callback
loader.onComplete = onAssetsLoaded

//begin load
loader.load();


// holder to store aliens
var aliens = [];
var alienFrames = ["eggHead.png", "flowerTop.png", "helmlok.png", "skully.png"];

var count = 0;

// create an new instance of a pixi stage
var stage = new PIXI.Stage(0xFFFFFF);;

// create a renderer instance.
var renderer = PIXI.autoDetectRenderer(800, 600);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

// create an empty container
var alienContainer = new PIXI.DisplayObjectContainer();
alienContainer.position.x = 400;
alienContainer.position.y = 300;

stage.addChild(alienContainer);

function onAssetsLoaded() {

	// create a texture from an image path
	// add a bunch of aliens
	for (var i = 0; i < 100; i++) {
		var frameName = alienFrames[i % 4];

		// create an alien using the frame name..
		var alien = PIXI.Sprite.fromFrame(frameName);

		/*
		 * fun fact for the day :)
		 * another way of doing the above would be
		 * var texture = PIXI.Texture.fromFrame(frameName);
		 * var alien = new PIXI.Sprite(texture);
		 */

		alien.position.x = Math.random() * 800 - 400;
		alien.position.y = Math.random() * 600 - 300;
		alien.anchor.x = 0.5;
		alien.anchor.y = 0.5;
		aliens.push(alien);
		alienContainer.addChild(alien);
	}

	// start animating
	requestAnimFrame(animate);


}

function animate() {

	requestAnimFrame(animate);

	// just for fun, lets rotate mr rabbit a little
	for (var i = 0; i < 100; i++) {
		var alien = aliens[i];
		alien.rotation += 0.1;
	}

	count += 0.01;
	alienContainer.scale.x = Math.sin(count)
	alienContainer.scale.y = Math.sin(count)

	alienContainer.rotation += 0.01
	// render the stage   
	renderer.render(stage);
}
