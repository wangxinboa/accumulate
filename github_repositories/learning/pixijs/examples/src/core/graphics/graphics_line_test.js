const app = new PIXI.Application({
	width: 620,
	height: 380,
});
// create an new instance of a pixi stage
var stage = app.stage;

// add the renderer view element to the DOM
document.body.appendChild(app.renderer.view);


var g = new PIXI.Graphics();
g.lineStyle(10, 0x000000, 1);
g.beginFill(0xff0000);
g.moveTo(0, 0);
g.drawRect(0, 0, 100, 100);

g.pivot.x = 50;
g.pivot.y = 50;

g.position.x = 100;
g.position.y = 100;

stage.addChild(g);

// lets create moving shape
var thing = new PIXI.Graphics();
stage.addChild(thing);
thing.position.x = 620 / 2;
thing.position.y = 380 / 2;

let count = 0;
app.ticker.add(() => {
	// count++;
	// if (count === 4) {
	// 	app.ticker.stop();
	// }

	thing.clear();
	g.rotation += 0.1;
	count += 0.1;
	thing.rotation = count * 0.1;
});