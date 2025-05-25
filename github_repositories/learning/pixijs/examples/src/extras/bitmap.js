const app = new PIXI.Application({
	width: 620,
	height: 400,
});
// create an new instance of a pixi stage
var stage = app.stage;

// add the renderer view element to the DOM
document.body.appendChild(app.renderer.view);

var loader = new PIXI.loaders.Loader();
loader.add('desyrel', "./assets/desyrel.fnt");

// use callback
loader.once('complete', onAssetsLoaded);

// begin load
loader.load();

function onAssetsLoaded() {
	var bitmapFontText = new PIXI.extras.BitmapText("bitmap fonts are\n now supported!", { font: "35px Desyrel", align: "right" });
	bitmapFontText.position.x = 620 - bitmapFontText.textWidth - 20;
	bitmapFontText.position.y = 20;

	stage.addChild(bitmapFontText);
}