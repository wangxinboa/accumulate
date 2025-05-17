window.onorientationchange = resize;
window.onresize = resize;

document.addEventListener('DOMContentLoaded', start, false);

//    Globals, globals everywhere and not a drop to drink
var w = 1024;
var h = 768;
var starCount = 2500;
var sx = 1.0 + (Math.random() / 20);
var sy = 1.0 + (Math.random() / 20);
var slideX = w / 2;
var slideY = h / 2;
var stars = [];
var renderer;
var stage;

function start() {
	var ballTexture = PIXI.Texture.fromImage("./demos/4.Balls/assets/bubble_32x32.png");
	renderer = PIXI.autoDetectRenderer(w, h);
	stage = new PIXI.Container();

	document.body.appendChild(renderer.view);

	for (var i = 0; i < starCount; i++) {
		var tempBall = new PIXI.Sprite(ballTexture);

		tempBall.position.x = (Math.random() * w) - slideX;
		tempBall.position.y = (Math.random() * h) - slideY;
		tempBall.anchor.x = 0.5;
		tempBall.anchor.y = 0.5;

		stars.push({ sprite: tempBall, x: tempBall.position.x, y: tempBall.position.y });

		stage.addChild(tempBall);
	}

	resize();

	requestAnimationFrame(update);
}

window.newWave = newWave;
function newWave(x, y) {
	sx = 1.0 + (Math.random() / 20);
	sy = 1.0 + (Math.random() / 20);
}

function resize() {
	w = window.innerWidth - 16;
	h = window.innerHeight - 16;

	slideX = w / 2;
	slideY = h / 2;

	renderer.resize(w, h);
}

function update() {
	for (var i = 0; i < starCount; i++) {
		stars[i].sprite.position.x = stars[i].x + slideX;
		stars[i].sprite.position.y = stars[i].y + slideY;
		stars[i].x = stars[i].x * sx;
		stars[i].y = stars[i].y * sy;

		if (stars[i].x > w) {
			stars[i].x = stars[i].x - w;
		}
		else if (stars[i].x < -w) {
			stars[i].x = stars[i].x + w;
		}

		if (stars[i].y > h) {
			stars[i].y = stars[i].y - h;
		}
		else if (stars[i].y < -h) {
			stars[i].y = stars[i].y + h;
		}
	}

	renderer.render(stage);

	requestAnimationFrame(update);
}