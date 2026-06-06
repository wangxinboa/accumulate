import { engine } from "../canvas_engine.module.js";
import { Text } from "../../src/render_node/2d/text/text.js";

const mouseDownTextString = "mouseDownText";
let mouseDownTextCount = 0;
const mouseDownText = new Text(`${mouseDownTextString}-${mouseDownTextCount}`).onMouseDown(() => {
	mouseDownText.text = `${mouseDownTextString}-${++mouseDownTextCount}`;
});
mouseDownText.x = 0;
mouseDownText.y = 200;
engine.scene.add(mouseDownText);

const mouseMoveTextString = "mouseMoveText";
let mouseMoveTextCount = 0;
const mouseMoveText = new Text(`${mouseMoveTextString}-${mouseMoveTextCount}`).onMouseMove(() => {
	mouseMoveText.text = `${mouseMoveTextString}-${++mouseMoveTextCount}`;
});
mouseMoveText.x = 300;
mouseMoveText.y = 200;
engine.scene.add(mouseMoveText);

const mouseUpTextString = "mouseUpText";
let mouseUpTextCount = 0;
const mouseUpText = new Text(`${mouseUpTextString}-${mouseUpTextCount}`).onMouseUp(() => {
	mouseUpText.text = `${mouseUpTextString}-${++mouseUpTextCount}`;
});
mouseUpText.x = 300;
mouseUpText.y = 300;
engine.scene.add(mouseUpText);

engine.timeTicker.start();
