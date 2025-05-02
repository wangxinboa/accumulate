// create an array of assets to load

var assetsToLoader = ["./demos/12.Spine/data/goblins.json"];

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
	var goblin = new PIXI.Spine("./demos/12.Spine/data/goblins.json");

	// set current skin
	goblin.skeleton.setSkinByName('goblin');
	goblin.skeleton.setSlotsToSetupPose();

	// set the position
	goblin.position.x = window.innerWidth / 2;
	goblin.position.y = window.innerHeight;

	goblin.scale.x = goblin.scale.y = window.innerHeight / 400;

	// play animation
	goblin.state.setAnimationByName(0, "walk", true);


	stage.addChild(goblin);

	stage.click = function () {
		// change current skin
		var currentSkinName = goblin.skeleton.skin.name;
		var newSkinName = (currentSkinName === 'goblin' ? 'goblingirl' : 'goblin');
		goblin.skeleton.setSkinByName(newSkinName);
		goblin.skeleton.setSlotsToSetupPose();
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



requestAnimFrame(animate);

function animate() {

	requestAnimFrame(animate);
	renderer.render(stage);
}