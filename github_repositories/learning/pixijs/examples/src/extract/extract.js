// Create a new app (will auto-add extract plugin to renderer)
const app = new PIXI.Application();
// Draw a red circle
const graphics = new PIXI.Graphics()
	.beginFill(0xFF0000)
	.drawCircle(0, 0, 50);

// Render the graphics as an HTMLImageElement
const image = app.renderer.plugins.extract.image(graphics);
document.body.appendChild(image);