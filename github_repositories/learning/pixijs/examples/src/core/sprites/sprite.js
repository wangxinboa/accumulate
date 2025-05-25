const app = new PIXI.Application({
	width: 400,
	height: 300,
});
// create an new instance of a pixi stage
var stage = app.stage;

// add the renderer view element to the DOM
document.body.appendChild(app.renderer.view);

// create a texture from an image path
var texture = PIXI.Texture.from("./assets/bunny.png");
window.texture = texture;
// create a new Sprite using the texture
var bunny = new PIXI.Sprite(texture);

// center the sprites anchor point
bunny.anchor.x = 0.5;
bunny.anchor.y = 0.5;

// move the sprite to the center of the screen
bunny.position.x = 200;
bunny.position.y = 150;

stage.addChild(bunny);


let count = 0;
app.ticker.add(() => {
	count++;
	if (count === 4) {
		app.ticker.stop();
	}
	bunny.rotation += 0.1;
});