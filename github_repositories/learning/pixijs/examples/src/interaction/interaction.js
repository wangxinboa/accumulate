const app = new PIXI.Application({
	width: 620,
	height: 400,
});
// create an new instance of a pixi stage
var stage = app.stage;
// add the renderer view element to the DOM
document.body.appendChild(app.renderer.view);

// create some textures from an image path
var textureButton = PIXI.Texture.fromImage("./demos/6.Interactivity/button.png");
var textureButtonDown = PIXI.Texture.fromImage("./demos/6.Interactivity/buttonDown.png");
var textureButtonOver = PIXI.Texture.fromImage("./demos/6.Interactivity/buttonOver.png");

var buttons = [];
var buttonPositions = [
	175, 75,
	600 - 145, 75,
	600 / 2 - 20, 400 / 2 + 10,
	175, 400 - 75,
	600 - 115, 400 - 95
];

for (var i = 0; i < 5; i++) {
	var button = new PIXI.Sprite(textureButton);
	button.buttonMode = true;

	button.anchor.x = 0.5;
	button.anchor.y = 0.5;

	button.position.x = buttonPositions[i * 2];
	button.position.y = buttonPositions[i * 2 + 1];

	// make the button interactive..
	button.interactive = true;

	// set the mousedown and touchstart callback..
	button.mousedown = button.touchstart = function (data) {
		this.isdown = true;
		this.texture = textureButtonDown;
		this.alpha = 1;
	};

	// set the mouseup and touchend callback..
	button.mouseup = button.touchend = button.mouseupoutside = button.touchendoutside = function (data) {
		this.isdown = false;

		if (this.isOver) {
			this.texture = textureButtonOver;
		}
		else {
			this.texture = textureButton;
		}
	};

	// set the mouseover callback..
	button.mouseover = function (data) {
		this.isOver = true;

		if (this.isdown)
			return;

		this.texture = textureButtonOver;
	};

	// set the mouseout callback..
	button.mouseout = function (data) {
		this.isOver = false;

		if (this.isdown)
			return;

		this.texture = textureButton;
	};

	button.click = function (data) {
		console.log("CLICK!");
	};

	button.tap = function (data) {
		console.log("TAP!!");
	};

	// add it to the stage
	stage.addChild(button);

	// add button to array
	buttons.push(button);
};

// set some silly values...
buttons[0].scale.x = 1.2;
buttons[1].scale.y = 1.2;
buttons[2].rotation = Math.PI / 10;
buttons[3].scale.x = 0.8;
buttons[3].scale.y = 0.8;
buttons[4].scale.x = 0.8;
buttons[4].scale.y = 1.2;
buttons[4].rotation = Math.PI;