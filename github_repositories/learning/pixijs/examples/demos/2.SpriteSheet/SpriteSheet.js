// create a new loader
var loader = new PIXI.loaders.Loader();
loader.add('SpriteSheet.json', "./demos/2.SpriteSheet/SpriteSheet.json");

// use callback
loader.once('complete', onAssetsLoaded);

//begin load
loader.load();

// holder to store aliens
var aliens = [];
var alienFrames = ["eggHead.png", "flowerTop.png", "helmlok.png", "skully.png"];

var count = 0;

const app = new PIXI.Application({
	width: 800,
	height: 600,
});
// create an new instance of a pixi stage
var stage = app.stage;

document.body.appendChild(app.renderer.view);

// create an empty container
var alienContainer = new PIXI.Container();
alienContainer.position.x = 400;
alienContainer.position.y = 300;

stage.addChild(alienContainer);

function onAssetsLoaded() {
	// add a bunch of aliens with textures from image paths
	for (var i = 0; i < 100; i++) {
		var frameName = alienFrames[i % 4];

		// create an alien using the frame name..
		var alien = PIXI.Sprite.fromFrame(frameName);
		alien.tint = Math.random() * 0xFFFFFF;

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
}

app.ticker.add(() => {
	// just for fun, lets rotate mr rabbit a little
	for (var i = 0; i < aliens.length; i++) {
		var alien = aliens[i];
		alien.rotation += 0.1;
	}

	count += 0.01;
	alienContainer.scale.x = Math.sin(count);
	alienContainer.scale.y = Math.sin(count);

	alienContainer.rotation += 0.01;
});
