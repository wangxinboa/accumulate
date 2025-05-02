// create an array of assets to load
var assetsToLoader = ["./demos/2.SpriteSheet/fighter.json"];

// create a new loader
var loader = new PIXI.AssetLoader(assetsToLoader);

// use callback
loader.onComplete = onAssetsLoaded;

//begin load
loader.load();

// holder to store aliens
var aliens = [];

var count = 0;

// create an new instance of a pixi stage
var stage = new PIXI.Stage(0xFFFFFF);

// create a renderer instance.
//    renderer = PIXI.autoDetectRenderer(800, 600);
var renderer = new PIXI.CanvasRenderer(800, 600);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

// create an empty container
var alienContainer = new PIXI.DisplayObjectContainer();
alienContainer.position.x = 400;
alienContainer.position.y = 300;

stage.addChild(alienContainer);

var movie;

function onAssetsLoaded() {
	// create a texture from an image path
	// add a bunch of aliens
	var frames = [];

	for (var i = 0; i < 30; i++) {
		var val = i < 10 ? "0" + i : i;
		frames.push(PIXI.Texture.fromFrame("rollSequence00" + val + ".png"));
	};

	movie = new PIXI.MovieClip(frames);

	movie.position.x = 300;
	movie.position.y = 300;

	movie.anchor.x = movie.anchor.y = 0.5;
	movie.play();
	movie.animationSpeed = 0.5;
	stage.addChild(movie);

	// start animating
	requestAnimFrame(animate);
}

function animate() {
	movie.rotation += 0.01;

	// render the stage
	renderer.render(stage);

	requestAnimFrame(animate);
}