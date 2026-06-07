import { engine } from "../canvas_engine.module.js";
import { Text } from "../../src/render_node/2d/text/text.js";

const mouseDownTextString = "mouseDownText";
let mouseDownTextCount = 0;
const mouseDownText = new Text(`${mouseDownTextString}-${mouseDownTextCount}`).onMouseDown(() => {
	mouseDownText.text = `${mouseDownTextString}-${++mouseDownTextCount}`;
});
mouseDownText.x = 0;
mouseDownText.y = 100;
engine.scene.add(mouseDownText);

const mouseUpTextString = "mouseUpText";
let mouseUpTextCount = 0;
const mouseUpText = new Text(`${mouseUpTextString}-${mouseUpTextCount}`).onMouseUp(() => {
	mouseUpText.text = `${mouseUpTextString}-${++mouseUpTextCount}`;
});
mouseUpText.x = 300;
mouseUpText.y = 100;
engine.scene.add(mouseUpText);

const mouseMoveTextString = "mouseMoveText";
let mouseMoveTextCount = 0;
const mouseMoveText = new Text(`${mouseMoveTextString}-${mouseMoveTextCount}`).onMouseMove(() => {
	mouseMoveText.text = `${mouseMoveTextString}-${++mouseMoveTextCount}`;
});
mouseMoveText.x = 0;
mouseMoveText.y = 200;
engine.scene.add(mouseMoveText);

const mouseEnterTextString = "mouseEnterText";
let mouseEnterTextCount = 0;
const mouseEnterText = new Text(`${mouseEnterTextString}-${mouseEnterTextCount}`).onMouseEnter(() => {
	mouseEnterText.text = `${mouseEnterTextString}-${++mouseEnterTextCount}`;
});
mouseEnterText.x = 0;
mouseEnterText.y = 300;
engine.scene.add(mouseEnterText);

const mouseLeaveTextString = "mouseLeaveText";
let mouseLeaveTextCount = 0;
const mouseLeaveText = new Text(`${mouseLeaveTextString}-${mouseLeaveTextCount}`).onMouseLeave(() => {
	mouseLeaveText.text = `${mouseLeaveTextString}-${++mouseLeaveTextCount}`;
});
mouseLeaveText.x = 300;
mouseLeaveText.y = 300;
engine.scene.add(mouseLeaveText);

const mouseDragTextString = "mouseDragText";
let mouseDragTextCount = 0;
const mouseDragText = new Text(`${mouseDragTextString}-${mouseDragTextCount}`).onDragStart(() => {
	mouseDragText.text = `${mouseDragTextString}-${++mouseDragTextCount}`;
});
mouseDragText.dragUpdatesPosition = true;
mouseDragText.x = 0;
mouseDragText.y = 400;
engine.scene.add(mouseDragText);

engine.timeTicker.start();
