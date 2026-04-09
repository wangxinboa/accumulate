import { Application } from "../../../../src/app/index.mjs";
import { loadImageBitmap } from "../../../../src/assets/loader/parsers/textures/loadTextures.mjs";
import { ImageSource } from "../../../../src/rendering/renderers/shared/texture/sources/ImageSource.mjs";
import { Sprite } from "../../../../src/scene/sprite/Sprite.mjs";
import { Texture } from "../../../../src/rendering/renderers/shared/texture/Texture.mjs";

// Create a new application
const app = new Application();

// Initialize the application
await app.init({ background: "#1099bb", resizeTo: window });
window.app = app;

// Append the application canvas to the document body
document.body.appendChild(app.canvas);

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
bunny.x = app.screen.width / 2;
bunny.y = app.screen.height / 2;

app.stage.addChild(bunny);

// Listen for animate update
app.ticker.add((time) => {
	// Just for fun, let's rotate mr rabbit a little.
	// * Delta is 1 if running at 100% performance *
	// * Creates frame-independent transformation *
	bunny.rotation += 0.05 * time.deltaTime;
});
