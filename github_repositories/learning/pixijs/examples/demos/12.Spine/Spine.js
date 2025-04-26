// create an array of assets to load

var assetsToLoader = ["./demos/12.Spine/data/spineboy.json", "./demos/12.Spine/data/spineboySpineData.json"];

// create a new loader
var loader = new PIXI.AssetLoader(assetsToLoader);

// use callback
loader.onComplete = onAssetsLoaded;

//begin load
loader.load();


// create an new instance of a pixi stage
var stage = new PIXI.Stage(0xFFFFFF, true);

// create a renderer instance
var renderer = new PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);

// set the canvas width and height to fill the screen
renderer.view.style.display = "block";

// add render view to DOM
document.body.appendChild(renderer.view);

function onAssetsLoaded() {
	// create a spine boy
	var spineBoy = new PIXI.Spine("./demos/12.Spine/data/spineboySpineData.json");

	// set the position
	spineBoy.position.x = window.innerWidth / 2;
	spineBoy.position.y = window.innerHeight;

	spineBoy.scale.x = spineBoy.scale.y = window.innerHeight / 400;

	// set up the mixes!
	spineBoy.stateData.setMixByName("walk", "jump", 0.2);
	spineBoy.stateData.setMixByName("jump", "walk", 0.4);

	// play animation
	spineBoy.state.setAnimationByName("walk", true);


	stage.addChild(spineBoy);

	stage.click = function () {
		spineBoy.state.setAnimationByName("jump", false);
		spineBoy.state.addAnimationByName("walk", true);

	};
}



requestAnimFrame(animate);

function animate() {

	requestAnimFrame(animate);
	renderer.render(stage);
}
