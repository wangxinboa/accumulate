import { engine } from "../canvas_engine_examples.module.js";
import { Sprite2D } from "../../src/render_nodes/2d/sprite2d/sprite2d.js";

const mouseDownTextString = "mouseDownText";
let mouseDownTextCount = 0;
const mouseDownText = Sprite2D.createFromText(`${mouseDownTextString}-${mouseDownTextCount}`).onMouseDown(() => {
	mouseDownText.text = `${mouseDownTextString}-${++mouseDownTextCount}`;
});
mouseDownText.x = 0;
mouseDownText.y = 100;
engine.scene.add(mouseDownText);

const mouseUpTextString = "mouseUpText";
let mouseUpTextCount = 0;
const mouseUpText = Sprite2D.createFromText(`${mouseUpTextString}-${mouseUpTextCount}`).onMouseUp(() => {
	mouseUpText.text = `${mouseUpTextString}-${++mouseUpTextCount}`;
});
mouseUpText.x = 300;
mouseUpText.y = 100;
engine.scene.add(mouseUpText);

const mouseMoveTextString = "mouseMoveText";
let mouseMoveTextCount = 0;
const mouseMoveText = Sprite2D.createFromText(`${mouseMoveTextString}-${mouseMoveTextCount}`).onMouseMove(() => {
	mouseMoveText.text = `${mouseMoveTextString}-${++mouseMoveTextCount}`;
});
mouseMoveText.x = 0;
mouseMoveText.y = 200;
engine.scene.add(mouseMoveText);

const mouseEnterTextString = "mouseEnterText";
let mouseEnterTextCount = 0;
const mouseEnterText = Sprite2D.createFromText(`${mouseEnterTextString}-${mouseEnterTextCount}`).onMouseEnter(() => {
	mouseEnterText.text = `${mouseEnterTextString}-${++mouseEnterTextCount}`;
});
mouseEnterText.x = 0;
mouseEnterText.y = 300;
engine.scene.add(mouseEnterText);

const mouseLeaveTextString = "mouseLeaveText";
let mouseLeaveTextCount = 0;
const mouseLeaveText = Sprite2D.createFromText(`${mouseLeaveTextString}-${mouseLeaveTextCount}`).onMouseLeave(() => {
	mouseLeaveText.text = `${mouseLeaveTextString}-${++mouseLeaveTextCount}`;
});
mouseLeaveText.x = 300;
mouseLeaveText.y = 300;
engine.scene.add(mouseLeaveText);

const mouseDragTextString = "mouseDragText";
let mouseDragTextCount = 0;
const mouseDragText = Sprite2D.createFromText(`${mouseDragTextString}-${mouseDragTextCount}`).onDragStart(() => {
	mouseDragText.text = `${mouseDragTextString}-${++mouseDragTextCount}`;
});
mouseDragText.dragUpdatesPosition = true;
mouseDragText.x = 0;
mouseDragText.y = 400;
engine.scene.add(mouseDragText);

engine.timeTicker.start();
