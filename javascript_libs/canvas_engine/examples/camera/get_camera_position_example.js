import { GUI } from "../../../../javascript_libs/lil-gui/dist/lil-gui.esm.js";
import { engine } from "../canvas_engine.module.js";
import { Sprite2D } from "../../src/render_node/2d/sprite2d/sprite2d.js";

const camera = engine.camera;
globalThis.camera = camera;

const sprite2DDown = Sprite2D.createFromUrl(
	"https://fastly.picsum.photos/id/902/20/20.jpg?hmac=1D9rRqsVpj0c559bCL-1Sd4HQ63BwJrzIjSze3DGFTA",
);
globalThis.sprite2DDown = sprite2DDown;
engine.scene.add(sprite2DDown);

const sprite2DMove = Sprite2D.createFromUrl(
	"https://fastly.picsum.photos/id/33/20/20.jpg?hmac=2qevnyLh9jL-kOMjRHF1xg1TyBmOATzt_B__g1C_E7Y",
);
globalThis.sprite2DMove = sprite2DMove;
engine.scene.add(sprite2DMove);

const sprite2DUp = Sprite2D.createFromUrl("https://pixijs.com/assets/bunny.png");
globalThis.sprite2DUp = sprite2DUp;
engine.scene.add(sprite2DUp);

engine.scene.onMouseDown((x, y) => {
	sprite2DDown.x = x;
	sprite2DDown.y = y;
});
engine.scene.onMouseMove((x, y) => {
	sprite2DMove.x = x;
	sprite2DMove.y = y;
});
engine.scene.onMouseUp((x, y) => {
	sprite2DUp.x = x;
	sprite2DUp.y = y;
});

engine.scene.onWheel((dx, dy) => {
	camera.x -= dx;
	camera.y -= dy;

	sprite2DMove.x += dx;
	sprite2DMove.y += dy;
});

const gui = new GUI();
const camera2DFolder = gui.addFolder("camera2D");

camera2DFolder.add(camera, "x", -6000, 6000, 0.01);
camera2DFolder.add(camera, "y", -6000, 6000, 0.01);
camera2DFolder.add(camera, "scaleX", -10, 10);
camera2DFolder.add(camera, "scaleY", -10, 10);
camera2DFolder.add(camera, "rotationAngle", -180, 180, 1).name("rotationAngle");
