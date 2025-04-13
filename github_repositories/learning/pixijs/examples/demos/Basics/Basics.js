// create an new instance of a pixi stage
var stage = new PIXI.Stage(0x66FF99);

// create a renderer instance.
var renderer = PIXI.autoDetectRenderer(400, 300);
window.renderer = renderer;

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

requestAnimFrame(animate);

// create a texture from an image path
var texture = PIXI.Texture.fromImage("./demos/Basics/bunny.png");
// create a new Sprite using the texture
var bunny = new PIXI.Sprite(texture);

// center the sprites anchor point
bunny.anchor.x = 0.5;
bunny.anchor.y = 0.5;

// move the sprite t the center of the screen
bunny.position.x = 200;
bunny.position.y = 150;

bunny.id = 1;
stage.addChild(bunny);


// var texture1 = PIXI.Texture.fromImage("./demos/Morph/assets/pixi.png");
// var bunny2 = new PIXI.Sprite(texture1);
var bunny2 = new PIXI.Sprite(texture);

// center the sprites anchor point
bunny2.anchor.x = 0;
bunny2.anchor.y = 0;

// move the sprite t the center of the screen
bunny2.position.x = 0;
bunny2.position.y = 150;
bunny2.alpha = 1;

bunny2.id = 2;
stage.addChild(bunny2);

function animate() {

	requestAnimFrame(animate);

	// just for fun, lets rotate mr rabbit a little
	bunny.rotation += 0.1;

	// render the stage   
	renderer.render(stage);
}
