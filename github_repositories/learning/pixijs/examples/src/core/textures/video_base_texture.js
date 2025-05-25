// // 需要在 VideoBaseTexture 中调整代码，不然会报错，属于框架本身的 bug
const app = new PIXI.Application({
	width: window.innerWidth,
	height: window.innerHeight,
});
// create an new instance of a pixi stage
var stage = app.stage;

// add the renderer view element to the DOM
document.body.appendChild(app.renderer.view);

// create a texture from an image path
// var texture = PIXI.Texture.fromVideo("./assets/testVideo.mp4");
var texture = new PIXI.Texture(
	PIXI.VideoBaseTexture.fromUrl('./assets/testVideo.mp4')
);

// create a new Sprite using the texture
var moveSprite = new PIXI.Sprite(texture);

// center the sprites anchor point
moveSprite.anchor.x = 0.5;
moveSprite.anchor.y = 0.5;

// move the sprite to the center of the screen
moveSprite.position.x = window.innerWidth / 2;
moveSprite.position.y = window.innerHeight / 2;


moveSprite.width = window.innerWidth;
moveSprite.height = window.innerHeight;

stage.addChild(moveSprite);
