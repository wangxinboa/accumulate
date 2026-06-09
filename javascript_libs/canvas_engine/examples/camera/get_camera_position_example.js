import { GUI } from "../../../../javascript_libs/lil-gui/dist/lil-gui.esm.js";
import { engine } from "../canvas_engine.module.js";
import { Sprite2D } from "../../src/render_node/2d/sprite2d/sprite2d.js";

const camera = engine.camera;
globalThis.camera = camera;

const sprite2dDown = Sprite2D.createFromUrl(
	"https://fastly.picsum.photos/id/902/20/20.jpg?hmac=1D9rRqsVpj0c559bCL-1Sd4HQ63BwJrzIjSze3DGFTA",
);
globalThis.sprite2dDown = sprite2dDown;
engine.scene.add(sprite2dDown);

const sprite2dMove = Sprite2D.createFromUrl(
	"https://fastly.picsum.photos/id/33/20/20.jpg?hmac=2qevnyLh9jL-kOMjRHF1xg1TyBmOATzt_B__g1C_E7Y",
);
globalThis.sprite2dMove = sprite2dMove;
engine.scene.add(sprite2dMove);

const sprite2dUp = Sprite2D.createFromUrl("https://pixijs.com/assets/bunny.png");
globalThis.sprite2dUp = sprite2dUp;
engine.scene.add(sprite2dUp);

engine.scene.onMouseDown((x, y) => {
	sprite2dDown.x = x;
	sprite2dDown.y = y;
});
engine.scene.onMouseMove((x, y) => {
	sprite2dMove.x = x;
	sprite2dMove.y = y;
});
engine.scene.onMouseUp((x, y) => {
	sprite2dUp.x = x;
	sprite2dUp.y = y;
});

engine.scene.onWheel((dx, dy) => {
	camera.x -= dx;
	camera.y -= dy;

	sprite2dMove.x += dx;
	sprite2dMove.y += dy;
});

const gui = new GUI();
const camera2dFolder = gui.addFolder("camera2d");

camera2dFolder.add(camera, "x", -6000, 6000, 0.01);
camera2dFolder.add(camera, "y", -6000, 6000, 0.01);
camera2dFolder.add(camera, "scaleX", -10, 10);
camera2dFolder.add(camera, "scaleY", -10, 10);
camera2dFolder.add(camera, "rotationAngle", -180, 180, 1).name("rotationAngle");
