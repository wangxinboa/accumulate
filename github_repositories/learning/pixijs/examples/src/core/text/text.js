const app = new PIXI.Application({
	width: 620,
	height: 400,
});
// create an new instance of a pixi stage
var stage = app.stage;

// add the renderer view element to the DOM
document.body.appendChild(app.renderer.view);


// create some white text using the Snippet webfont
var textSample = new PIXI.Text("Pixi.js can has\nmultiline text!", { font: "35px Snippet", fill: "white", align: "left" });
textSample.position.x = 20;
textSample.position.y = 20;

// create a text object with a nice stroke
var spinningText = new PIXI.Text("I'm fun!", { font: "bold 60px Arial", fill: "#cc00ff", align: "center", stroke: "#FFFFFF", strokeThickness: 20 });

// setting the anchor point to 0.5 will center align the text... great for spinning!
spinningText.anchor.x = spinningText.anchor.y = 0.5;
spinningText.position.x = 620 / 2;
spinningText.position.y = 400 / 2;

// create a text object that will be updated..
var countingText = new PIXI.Text("COUNT 4EVAR: 0", { font: "bold italic 60px Arvo", fill: "#3e1707", align: "center", stroke: "#a4410e", strokeThickness: 7 });
countingText.position.x = 620 / 2;
countingText.position.y = 320;
countingText.anchor.x = 0.5;

stage.addChild(textSample);
stage.addChild(spinningText);
stage.addChild(countingText);


// let count = 0;
// app.ticker.add(() => {
// 	count += 0.1;
// 	countingText.text = "COUNT 4EVAR: " + (count | 0);
// });
