// create an new instance of a pixi stage
var stage = new PIXI.Container(0x000000);

// create a renderer instance
var renderer = new PIXI.autoDetectRenderer(800, 600);

// set the canvas width and height to fill the screen
renderer.view.style.width = window.innerWidth + "px";
renderer.view.style.height = window.innerHeight + "px";
renderer.view.style.display = "block";

// add render view to DOM
document.body.appendChild(renderer.view);

// OOH! SHINY!
// create two render textures.. these dynamic textures will be used to draw the scene into itself
var renderTexture = PIXI.RenderTexture.create(800, 600);
var renderTexture2 = PIXI.RenderTexture.create(800, 600);
var currentTexture = renderTexture;

// create a new sprite that uses the render texture we created above
var outputSprite = new PIXI.Sprite(currentTexture);

// align the sprite
outputSprite.position.x = 800 / 2;
outputSprite.position.y = 600 / 2;
outputSprite.anchor.x = 0.5;
outputSprite.anchor.y = 0.5;

// add to stage
stage.addChild(outputSprite);

var stuffContainer = new PIXI.Container();

stuffContainer.position.x = 800 / 2;
stuffContainer.position.y = 600 / 2;

stage.addChild(stuffContainer);

// create an array of image ids..
var fruits = [
	"./demos/11.RenderTexture/spinObj_01.png", "./demos/11.RenderTexture/spinObj_02.png",
	"./demos/11.RenderTexture/spinObj_03.png", "./demos/11.RenderTexture/spinObj_04.png",
	"./demos/11.RenderTexture/spinObj_05.png", "./demos/11.RenderTexture/spinObj_06.png",
	"./demos/11.RenderTexture/spinObj_07.png", "./demos/11.RenderTexture/spinObj_08.png"
];

// create an array of items
var items = [];

// now create some items and randomly position them in the stuff container
for (var i = 0; i < 20; i++) {
	var item = PIXI.Sprite.fromImage(fruits[i % fruits.length]);
	item.position.x = Math.random() * 400 - 200;
	item.position.y = Math.random() * 400 - 200;

	item.anchor.x = 0.5;
	item.anchor.y = 0.5;

	stuffContainer.addChild(item);

	items.push(item);
};

// used for spinning!
var count = 0;

requestAnimationFrame(animate);

function animate() {

	requestAnimationFrame(animate);

	for (var i = 0; i < items.length; i++) {
		// rotate each item
		var item = items[i];
		item.rotation += 0.1;
	};

	count += 0.01;

	// swap the buffers..
	var temp = renderTexture;
	renderTexture = renderTexture2;
	renderTexture2 = temp;

	// set the new texture
	outputSprite.texture = renderTexture;

	// twist this up!
	stuffContainer.rotation -= 0.01;
	outputSprite.scale.x = outputSprite.scale.y = 1 + Math.sin(count) * 0.2;

	// render the stage to the texture
	// the true clears the texture before content is rendered
	// renderTexture2.render(stage, null, true);
	renderer.render(stage, renderTexture2);

	// and finally render the stage
	renderer.render(stage);
}