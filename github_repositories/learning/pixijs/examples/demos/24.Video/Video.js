const app = new PIXI.Application();
// create an new instance of a pixi stage
var stage = app.stage;

// add the renderer view element to the DOM
document.body.appendChild(app.renderer.view);

// create a texture from an image path
var texture = PIXI.Texture.fromVideo("./demos/24.Video/testVideo.mp4");

// create a new Sprite using the texture
var moveSprite = new PIXI.Sprite(texture);

// center the sprites anchor point
moveSprite.anchor.x = 0.5;
moveSprite.anchor.y = 0.5;

// move the sprite to the center of the screen
moveSprite.position.x = window.innerWidth / 2;
moveSprite.position.y = window.innerHeight / 2;


var colorMatrix = [1, 0, 0, 0,
	0, 1, 0, 0,
	0, 0, 1, 0,
	0, 0, 0, 1];

var filter = new PIXI.filters.ColorMatrixFilter();

// moveSprite.filters = [filter];

moveSprite.width = window.innerWidth;
moveSprite.height = window.innerHeight;

stage.addChild(moveSprite);

var count = 0;

var text = new PIXI.Text("DEUS", { fill: "white", font: "bold 444px Arial" });
stage.addChild(text);

text.anchor.set(0.5);
text.x = window.innerWidth / 2;
text.y = window.innerHeight / 2;

app.ticker.add(() => {

	count += 0.1;

	colorMatrix[1] = Math.sin(count) * 3;
	colorMatrix[2] = Math.cos(count);
	colorMatrix[3] = Math.cos(count) * 1.5;
	colorMatrix[4] = Math.sin(count / 3) * 2;
	colorMatrix[5] = Math.sin(count / 2);
	colorMatrix[6] = Math.sin(count / 4);
	filter.matrix = colorMatrix;
	filter.syncUniforms();
});

window.onresize = function () {
	app.renderer.resize(window.innerWidth, window.innerHeight);
	moveSprite.width = window.innerWidth;
	moveSprite.height = window.innerHeight;

	text.scale.set((window.innerWidth * 0.2) / text.texture.width);

	text.x = window.innerWidth / 2;
	text.y = window.innerHeight / 2;

	// move the sprite to the center of the screen
	moveSprite.position.x = window.innerWidth / 2;
	moveSprite.position.y = window.innerHeight / 2;

};

window.onresize();