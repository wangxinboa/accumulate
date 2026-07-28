import { engine } from "../canvas_engine_examples.module.js";
import { Sprite2D } from "../../src/render_nodes/2d/sprite2d/sprite2d.js";
import { GUI } from "../../../../javascript_libs/lil-gui/dist/lil-gui.esm.js";

const camera = engine.camera;

const sprite2DDown = Sprite2D.createFromUrl("../assets/902-20x20.jpg");
engine.scene.add(sprite2DDown);

const sprite2DMove = Sprite2D.createFromUrl("../assets/33-20x20.jpg");
engine.scene.add(sprite2DMove);

const sprite2DUp = Sprite2D.createFromUrl("../assets/bunny.png");
engine.scene.add(sprite2DUp);

engine.scene.addMouseDownEvent((_node, x, y) => {
	sprite2DDown.x = x;
	sprite2DDown.y = y;
});
engine.scene.addMouseMoveEvent((_node, x, y) => {
	sprite2DMove.x = x;
	sprite2DMove.y = y;
});
engine.scene.addMouseUpEvent((_node, x, y) => {
	sprite2DUp.x = x;
	sprite2DUp.y = y;
});

const gui = new GUI();
const camera2DFolder = gui.addFolder("camera2D");

camera2DFolder.add(camera, "x", -6000, 6000, 0.01);
camera2DFolder.add(camera, "y", -6000, 6000, 0.01);
camera2DFolder.add(camera, "scaleX", -10, 10);
camera2DFolder.add(camera, "scaleY", -10, 10);
camera2DFolder.add(camera, "rotationAngle", -180, 180, 1).name("rotationAngle");
