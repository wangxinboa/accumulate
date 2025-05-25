var viewWidth = 800;
var viewHeight = 600;

const app = new PIXI.Application({
	width: viewWidth,
	height: viewHeight,
});
// create an new instance of a pixi stage
var stage = app.stage;

// add the renderer view element to the DOM
document.body.appendChild(app.renderer.view);


var sprites = new PIXI.particles.ParticleContainer();
stage.addChild(sprites);

var tints = [0xFFFFFF, 0xFFFBEE, 0xFFEEEE, 0xFADEED, 0xE8D4CD];

// create an array to store a refference to the fish in the pond
var dudeArray = [];

var totalDudes = app.renderer instanceof PIXI.WebGLRenderer ? 10000 : 100;
for (var i = 0; i < totalDudes; i++) {
	// create a new Sprite that uses the image name that we just generated as its source
	var dude = PIXI.Sprite.fromImage("./demos/18.Batch/tinyMaggot.png");

	dude.tint = Math.random() * 0xE8D4CD;

	// set the anchor point so the the dude texture is centerd on the sprite
	dude.anchor.x = dude.anchor.y = 0.5;

	// set a random scale for the dude - no point them all being the same size!
	dude.scale.x = dude.scale.y = 0.8 + Math.random() * 0.3;

	// finally lets set the dude to be a random position..
	dude.x = Math.random() * viewWidth;
	dude.y = Math.random() * viewHeight;

	// create some extra properties that will control movement
	dude.tint = Math.random() * 0x808080;

	// create a random direction in radians. This is a number between 0 and PI*2 which is the equivalent of 0 - 360 degrees
	dude.direction = Math.random() * Math.PI * 2;

	// this number will be used to modify the direction of the dude over time
	dude.turningSpeed = Math.random() - 0.8;

	// create a random speed for the dude between 0 - 2
	dude.speed = (2 + Math.random() * 2) * 0.2;

	dude.offset = Math.random() * 100;

	// finally we push the dude into the dudeArray so it it can be easily accessed later
	dudeArray.push(dude);

	sprites.addChild(dude);
}

// create a bounding box box for the little dudes 
var dudeBoundsPadding = 100;
var dudeBounds = new PIXI.Rectangle(-dudeBoundsPadding,
	-dudeBoundsPadding,
	viewWidth + dudeBoundsPadding * 2,
	viewHeight + dudeBoundsPadding * 2);

var tick = 0;

// let count = 0;
app.ticker.add(() => {
	// iterate through the dude and update the position
	for (var i = 0; i < dudeArray.length; i++) {
		var dude = dudeArray[i];
		dude.scale.y = 0.95 + Math.sin(tick + dude.offset) * 0.05;
		dude.direction += dude.turningSpeed * 0.01;
		dude.position.x += Math.sin(dude.direction) * (dude.speed * dude.scale.y);
		dude.position.y += Math.cos(dude.direction) * (dude.speed * dude.scale.y);
		dude.rotation = -dude.direction + Math.PI;

		// wrap the dudes by testing their bounds..
		if (dude.position.x < dudeBounds.x)
			dude.position.x += dudeBounds.width;
		else if (dude.position.x > dudeBounds.x + dudeBounds.width)
			dude.position.x -= dudeBounds.width;

		if (dude.position.y < dudeBounds.y)
			dude.position.y += dudeBounds.height;
		else if (dude.position.y > dudeBounds.y + dudeBounds.height)
			dude.position.y -= dudeBounds.height;
	}

	// increment the ticker
	tick += 0.1;
});