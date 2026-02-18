import app from "../../../reproduction_libs/app/Application.js";
import { loadImageBitmap } from "../../../reproduction_libs/assets/loader/parsers/textures/loadTextures.js";
import { ImageSource } from "../../../reproduction_libs/rendering/renderers/shared/texture/sources/ImageSource.js";
import { Sprite } from "../../../reproduction_libs/scene/sprite/Sprite.js";
import { Texture } from "../../../reproduction_libs/rendering/renderers/shared/texture/Texture.js";

await app.init({ background: "#1099bb", resizeTo: window, autoStart: true });

document.body.appendChild(app.renderer.view.canvas);

// Load the bunny texture
const imageBitmap = await loadImageBitmap("https://pixijs.com/assets/bunny.png");
const imageSource = new ImageSource({
	resource: imageBitmap,
	alphaMode: "premultiply-alpha-on-upload",
	resolution: 1,
});
const texture = new Texture({
	source: imageSource,
});

// Create a bunny Sprite
const bunny = new Sprite(texture);

// Center the sprite's anchor point
bunny.anchor.set(0.5);

// Move the sprite to the center of the screen
bunny.x = app.renderer.view.screen.width / 2;
bunny.y = app.renderer.view.screen.height / 2;

app.stage.addChild(bunny);

// Listen for animate update
app.ticker.add((time) => {
	// Just for fun, let's rotate mr rabbit a little.
	// * Delta is 1 if running at 100% performance *
	// * Creates frame-independent transformation *
	bunny.rotation += 0.1 * time.deltaTime;
});
