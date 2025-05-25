const app = new PIXI.Application({
	width: 620,
	height: 380,
});
// create an new instance of a pixi stage
var stage = app.stage;
stage.interactive = true;

// add the renderer view element to the DOM
document.body.appendChild(app.renderer.view);

// create a renderer instance
app.renderer.view.style.position = "absolute";
app.renderer.view.style.width = window.innerWidth + "px";
app.renderer.view.style.height = window.innerHeight + "px";
app.renderer.view.style.display = "block";

var bg = PIXI.Sprite.fromImage("./demos/15.Filters/BGrotate.jpg");
bg.anchor.x = 0.5;
bg.anchor.y = 0.5;

bg.position.x = 620 / 2;
bg.position.y = 380 / 2;

var colorMatrix = [1, 0, 0, 0,
	0, 1, 0, 0,
	0, 0, 1, 0,
	0, 0, 0, 1];

var filter = new PIXI.filters.ColorMatrixFilter();

var container = new PIXI.Container();
container.position.x = 620 / 2;
container.position.y = 380 / 2;

var bgFront = PIXI.Sprite.fromImage("./demos/15.Filters/SceneRotate.jpg");
bgFront.anchor.x = 0.5;
bgFront.anchor.y = 0.5;

container.addChild(bgFront);

var light2 = PIXI.Sprite.fromImage("./demos/15.Filters/LightRotate2.png");
light2.anchor.x = 0.5;
light2.anchor.y = 0.5;
container.addChild(light2);

var light1 = PIXI.Sprite.fromImage("./demos/15.Filters/LightRotate1.png");
light1.anchor.x = 0.5;
light1.anchor.y = 0.5;
container.addChild(light1);

var panda = PIXI.Sprite.fromImage("./demos/15.Filters/panda.png");
panda.anchor.x = 0.5;
panda.anchor.y = 0.5;

container.addChild(panda);

stage.addChild(container);

stage.filters = [filter];

var count = 0;
var switchy = false;

stage.click = stage.tap = function () {
	switchy = !switchy;

	if (!switchy) {
		stage.filters = [filter];
	}
	else {
		stage.filters = null;
	}
};

let time = 0;
app.ticker.add(() => {
	time++;
	if (time === 20) {
		app.ticker.stop();
	}

	bg.rotation += 0.01;
	bgFront.rotation -= 0.01;

	light1.rotation += 0.02;
	light2.rotation += 0.01;

	panda.scale.x = 1 + Math.sin(count) * 0.04;
	panda.scale.y = 1 + Math.cos(count) * 0.04;

	count += 0.1;

	colorMatrix[1] = Math.sin(count) * 3;
	colorMatrix[2] = Math.cos(count);
	colorMatrix[3] = Math.cos(count) * 1.5;
	colorMatrix[4] = Math.sin(count / 3) * 2;
	colorMatrix[5] = Math.sin(count / 2);
	colorMatrix[6] = Math.sin(count / 4);
	filter.matrix = colorMatrix;
});
