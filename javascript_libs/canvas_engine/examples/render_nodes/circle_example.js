import { engine } from "../canvas_engine_examples.module.js";
import { Circle } from "../../src/render_nodes/2d/circle/circle.js";
import { Color } from "../../src/math/color.js";
import { Sprite2D } from "../../src/render_nodes/2d/sprite2d/sprite2d.js";
import { GUI } from "../../../../javascript_libs/lil-gui/dist/lil-gui.esm.js";

// 显示操作提示
const info = Sprite2D.createFromText("点击点改变颜色和大小");
info.y = -200;
engine.scene.add(info);

// 添加一个背景文字说明
const desc = Sprite2D.createFromText("Point 示例");
desc.y = desc.height + info.y;
engine.scene.add(desc);

// 创建一个点，半径30，红色，半透明
const circle = new Circle(100, new Color(1, 1, 0, 1));
circle.color.hexString = "#87876e";
circle.centerSelf();
engine.scene.add(circle);

// 点击点改变颜色和半径
circle.addMouseDownEvent(() => {
	circle.color = new Color(Math.random(), Math.random(), Math.random());
});

// ===== GUI 控制 =====
const gui = new GUI({ title: "Circle 控制" });

// 添加半径控制
gui.add(circle, "radius", 0, 100, 0.1).name("半径");

// 添加颜色控制
gui.addColor(circle.color, "hexString").name("颜色");

// 添加透明度控制（可选）
gui
	.add(circle.color, "a", 0, 1, 0.01)
	.name("透明度")
	.onChange((/** @type {number} */ val) => {
		circle.color.setAlpha(val);
	});
