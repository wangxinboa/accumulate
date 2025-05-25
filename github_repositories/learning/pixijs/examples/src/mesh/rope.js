const app = new PIXI.Application({
	width: 620,
	height: 380,
});
// create an new instance of a pixi stage
var stage = app.stage;

// add the renderer view element to the DOM
document.body.appendChild(app.renderer.view);


// create an empty container
var count = 0;

// build a rope!
var length = 918 / 20;
var points = [];
for (var i = 0; i < 20; i++) {
	var segSize = length;
	points.push(new PIXI.Point(i * length, 0));
};

var strip = new PIXI.mesh.Rope(PIXI.Texture.fromImage("./demos/20.Strip/snake.png"), points);
strip.x = -918 / 2;
window.strip = strip;
strip.size = 40;

var snakeContainer = new PIXI.Container();
snakeContainer.position.x = window.innerWidth / 2;
snakeContainer.position.y = window.innerHeight / 2;

snakeContainer.scale.set(window.innerWidth / 1100);
stage.addChild(snakeContainer);

snakeContainer.addChild(strip);


let time = 0;
app.ticker.add(() => {
	time++;
	if (time === 100) {
		app.ticker.stop();
	}

	count += 0.1;
	var length = 918 / 20;

	for (var i = 0; i < points.length; i++) {
		points[i].y = Math.sin(i * 0.5 + count) * 30;
		points[i].x = i * length + Math.cos(i * 0.3 + count) * 20;
	};
});