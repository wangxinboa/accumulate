import { engine } from "../canvas_engine_examples.module.js";
import { Circle } from "../../src/render_nodes/2d/circle/circle.js";
import { Color } from "../../src/math/color.js";
import { Sprite2D } from "../../src/render_nodes/2d/sprite2d/sprite2d.js";

// 创建一个点，半径30，红色，半透明
const circle = new Circle(30, new Color(1, 1, 0, 1));
circle.x = 400;
circle.y = 200;
circle.centerSelf();
engine.scene.add(circle);

// 点击点改变颜色和半径
circle.onMouseDown(() => {
	circle.color = new Color(Math.random(), Math.random(), Math.random());
	circle.radius = 20 + Math.random() * 40;
});

// 显示操作提示
const info = Sprite2D.createFromText("点击点改变颜色和大小");
info.x = 20;
info.y = 50;
engine.scene.add(info);

// 添加一个背景文字说明
const desc = Sprite2D.createFromText("Point 示例");
desc.x = 20;
desc.y = 20;
engine.scene.add(desc);

// let count = 0;

// engine.timeTicker.addRunCallback(function () {
// 	if (count > 30) {
// 		// engine.timeTicker.pause();
// 	}

// 	count++;
// });
