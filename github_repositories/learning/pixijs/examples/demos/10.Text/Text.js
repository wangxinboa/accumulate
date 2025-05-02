function runList(item) {
	console.log(">>>>>>>>>");
	console.log("_");
	var safe = 0;
	var tmp = item;
	while (tmp._iNext) {
		safe++;
		//		console.log(tmp.childIndex + tmp);
		tmp = tmp._iNext;
		console.log(tmp);//.childIndex);
		//	console.log(tmp);

		if (safe > 100) {
			console.log("BREAK");
			break;
		}
	}
}
init();
function init() {
	var assetsToLoader = ["./demos/10.Text/desyrel.fnt"];

	// create a new loader
	var loader = new PIXI.AssetLoader(assetsToLoader);

	// use callback
	loader.onComplete = onAssetsLoaded;

	//begin load

	// create an new instance of a pixi stage
	var stage = new PIXI.Stage(0x66FF99);

	loader.load();
	function onAssetsLoaded() {
		var bitmapFontText = new PIXI.BitmapText("bitmap fonts are\n now supported!", { font: "35px Desyrel", align: "right" });
		bitmapFontText.position.x = 620 - bitmapFontText.width - 20;
		bitmapFontText.position.y = 20;

		runList(bitmapFontText);
		stage.addChild(bitmapFontText);


	}



	// add a shiney background..
	var background = PIXI.Sprite.fromImage("./demos/10.Text/textDemoBG.jpg");
	stage.addChild(background);

	// create a renderer instance
	var renderer = PIXI.autoDetectRenderer(620, 400);
	// add the renderer view element to the DOM
	document.body.appendChild(renderer.view);

	requestAnimFrame(animate);

	// create some white text using the Snippet webfont
	var textSample = new PIXI.Text("Pixi.js can has\nmultiline text!", { font: "35px Snippet", fill: "white", align: "left" });
	textSample.position.x = 20;
	textSample.position.y = 20;

	// create a text object with a nice stroke
	var spinningText = new PIXI.Text("I'm fun!", { font: "bold 60px Podkova", fill: "#cc00ff", align: "center", stroke: "#FFFFFF", strokeThickness: 6 });
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

	var count = 0;
	var score = 0;

	function animate() {

		requestAnimFrame(animate);
		count++;
		if (count == 50) {
			count = 0;
			score++;
			// update the text...
			countingText.setText("COUNT 4EVAR: " + score);

		}
		// just for fun, lets rotate the text
		spinningText.rotation += 0.03;

		// render the stage
		renderer.render(stage);
	}
}