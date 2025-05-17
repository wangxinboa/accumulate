// create an array of assets to load

var assetsToLoader = ["./demos/12.Spine/data/spineboy.json"];

// create a new loader
var loader = new PIXI.AssetLoader(assetsToLoader);

// use callback
loader.onComplete = onAssetsLoaded;

//begin load
loader.load();


// create an new instance of a pixi stage
var stage = new PIXI.Container(0xFFFFFF, true);

// create a renderer instance
var renderer = new PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);

// set the canvas width and height to fill the screen
renderer.view.style.display = "block";

// add render view to DOM
document.body.appendChild(renderer.view);

function onAssetsLoaded() {
	// create a spine boy
	var spineBoy = new PIXI.Spine("./demos/12.Spine/data/spineboy.json");

	// set the position
	spineBoy.position.x = window.innerWidth / 2;
	spineBoy.position.y = window.innerHeight;

	spineBoy.scale.x = spineBoy.scale.y = window.innerHeight / 400;

	// set up the mixes!
	spineBoy.stateData.setMixByName("walk", "jump", 0.2);
	spineBoy.stateData.setMixByName("jump", "walk", 0.4);

	// play animation
	spineBoy.state.setAnimationByName(0, "walk", true);


	stage.addChild(spineBoy);

	stage.click = function () {
		spineBoy.state.setAnimationByName(0, "jump", false);
		spineBoy.state.addAnimationByName(0, "walk", true, 0);

	};

	var logo = PIXI.Sprite.fromImage("./logo_small.png");
	stage.addChild(logo);


	logo.anchor.x = 1;
	logo.position.x = window.innerWidth;
	logo.scale.x = logo.scale.y = 0.5;
	logo.position.y = window.innerHeight - 70;
	logo.interactive = true;
	logo.buttonMode = true;
	logo.click = logo.tap = function () {
		window.open("https://github.com/GoodBoyDigital/pixi.js", "_blank");
	};
}



requestAnimationFrame(animate);

function animate() {

	requestAnimationFrame(animate);
	renderer.render(stage);
}