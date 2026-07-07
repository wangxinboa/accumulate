import { engine } from "../canvas_engine_examples.module.js";
import { Sprite2D } from "../../src/render_nodes/2d/sprite2d/sprite2d.js";

const sprite2D = Sprite2D.createFromUrl("../assets/bunny.png");

sprite2D.setTween("to1", {
	delayTime: 500,
	duration: 1000,
	loopCount: 4,
	yoyo: true,
	targets: [
		{
			path: ["x"],
			target: 100,
		},
		{
			path: ["y"],
			target: 300,
		},
	],
});

engine.scene.add(sprite2D);

const start = Sprite2D.createFromText("start").addMouseDownEvent(() => {
	console.info("start addMouseDownEvent");
	sprite2D.startTween("to1");
});
start.x = 300;
engine.scene.add(start);

const stop = Sprite2D.createFromText("stop").addMouseDownEvent(() => {
	console.info("stop addMouseDownEvent");
	sprite2D.pauseTween();
});
stop.x = 400;
engine.scene.add(stop);

const resume = Sprite2D.createFromText("resume").addMouseDownEvent(() => {
	console.info("resume addMouseDownEvent");
	sprite2D.resumeTween();
});
resume.x = 500;
engine.scene.add(resume);
