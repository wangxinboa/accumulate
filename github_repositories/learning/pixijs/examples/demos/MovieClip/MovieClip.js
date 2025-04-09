// create an array of assets to load
var assetsToLoader = ["./demos/MovieClip/SpriteSheet.json"];

// create a new loader
var loader = new PIXI.AssetLoader(assetsToLoader);

// use callback
loader.onComplete = onAssetsLoaded

//begin load
loader.load();


// holder to store aliens
var explosions = [];

var count = 0;

// create an new instance of a pixi stage
var stage = new PIXI.Stage(0xFFFFFF);;

// create a renderer instance.
var renderer = PIXI.autoDetectRenderer(800, 600);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

function onAssetsLoaded() {
	// create an array to store the textures
	var explosionTextures = [];

	for (var i = 0; i < 26; i++) {
		var texture = PIXI.Texture.fromFrame("Explosion_Sequence_A " + (i + 1) + ".png");
		explosionTextures.push(texture);
	};

	// create a texture from an image path
	// add a bunch of aliens
	for (var i = 0; i < 50; i++) {
		// create an explosion MovieClip
		var explosion = new PIXI.MovieClip(explosionTextures);


		explosion.position.x = Math.random() * 800;
		explosion.position.y = Math.random() * 600;
		explosion.anchor.x = 0.5;
		explosion.anchor.y = 0.5;

		explosion.rotation = Math.random() * Math.PI;
		explosion.scale.x = explosion.scale.y = 0.75 + Math.random() * 0.5

		explosion.gotoAndPlay(Math.random() * 27);

		stage.addChild(explosion);
	}

	// start animating
	requestAnimFrame(animate);


}

function animate() {

	requestAnimFrame(animate);

	renderer.render(stage);
}