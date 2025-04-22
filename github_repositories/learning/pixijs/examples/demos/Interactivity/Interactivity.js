
var interactive = true;

var stage = new PIXI.Stage(0x000000, interactive);

// create a renderer instance.
var renderer = PIXI.autoDetectRenderer(620, 400);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

requestAnimFrame(animate);

// create a background..
var background = PIXI.Sprite.fromImage("./demos/Interactivity/button_test_BG.jpg");

// add background to stage..
stage.addChild(background);

// create some textures from an image path
var textureButton = PIXI.Texture.fromImage("./demos/Interactivity/button.png");
var textureButtonDown = PIXI.Texture.fromImage("./demos/Interactivity/buttonDown.png");
var textureButtonOver = PIXI.Texture.fromImage("./demos/Interactivity/buttonOver.png");

var buttons = [];

var buttonPositions = [175, 75,
	600 - 145, 75,
	600 / 2 - 20, 400 / 2 + 10,
	175, 400 - 75,
	600 - 115, 400 - 95];


for (var i = 0; i < 5; i++) {
	var button = new PIXI.Sprite(textureButton);

	button.anchor.x = 0.5;
	button.anchor.y = 0.5;

	button.position.x = buttonPositions[i * 2];
	button.position.y = buttonPositions[i * 2 + 1];

	// make the button interactive..		
	button.setInteractive(true);

	// set the mousedown and touchstart callback..
	button.mousedown = button.touchstart = function (data) {

		this.isdown = true;
		this.setTexture(textureButtonDown);
		this.alpha = 1;
	};

	// set the mouseup and touchend callback..
	button.mouseup = button.touchend = function (data) {
		this.isdown = false;

		if (this.isOver) {
			this.setTexture(textureButtonOver);
		}
		else {
			this.setTexture(textureButton);
		}
	};

	// set the mouseover callback..
	button.mouseover = function (data) {

		this.isOver = true;

		if (this.isdown) return;

		this.setTexture(textureButtonOver);
	};

	// set the mouseout callback..
	button.mouseout = function (data) {

		this.isOver = false;
		if (this.isdown) return;
		this.setTexture(textureButton);
	};

	button.click = function (data) {
		// click!
		console.log("CLICK!");
		//	alert("CLICK!")
	};

	button.tap = function (data) {
		// click!
		console.log("TAP!!");
		//this.alpha = 0.5;
	};

	// add it to the stage
	stage.addChild(button);

	// add button to array
	buttons.push(button);
};

// set some silly values..

buttons[0].scale.x = 1.2;

buttons[1].scale.y = 1.2;

buttons[2].rotation = Math.PI / 10;

buttons[3].scale.x = 0.8;
buttons[3].scale.y = 0.8;

buttons[4].scale.x = 0.8;
buttons[4].scale.y = 1.2;
buttons[4].rotation = Math.PI;
// var button1 = 
function animate() {

	requestAnimFrame(animate);
	// render the stage   

	// do a test..

	renderer.render(stage);
}