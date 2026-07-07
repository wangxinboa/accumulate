import { engine } from "../canvas_engine_examples.module.js";
import { Rectangle } from "../../src/render_nodes/2d/rectangle/rectangle.js";
import { Color } from "../../src/math/color.js";
import { Sprite2D } from "../../src/render_nodes/2d/sprite2d/sprite2d.js";
import { GUI } from "../../../../javascript_libs/lil-gui/dist/lil-gui.esm.js";

const camera = engine.camera;

engine.scene.onWheel((_node, dx, dy) => {
	camera.x -= dx;
	camera.y -= dy;
});

// 创建一个矩形，默认宽高100，红色半透明
const rectangle = new Rectangle(150, 100, new Color(1, 1, 0, 0.8));
rectangle.x = 400;
rectangle.y = 200;
rectangle.centerSelf();
engine.scene.add(rectangle);

// 点击矩形改变颜色
rectangle.onMouseDown(() => {
	rectangle.color = new Color(Math.random(), Math.random(), Math.random(), 1);
});

// 显示操作提示
const info = Sprite2D.createFromText("点击矩形改变颜色和大小");
info.x = 20;
info.y = 50;
engine.scene.add(info);

// 添加一个背景文字说明
const desc = Sprite2D.createFromText("Rectangle 示例");
desc.x = 20;
desc.y = 20;
engine.scene.add(desc);

// ===== GUI 控制 =====
const gui = new GUI({ title: "Rectangle 控制" });

// 添加宽高控制
gui.add(rectangle, "width", 10, 300, 1).name("宽度");
gui.add(rectangle, "height", 10, 300, 1).name("高度");

// 添加颜色控制
gui.addColor(rectangle.color, "hexString").name("颜色");

// 添加透明度控制（可选）
gui
	.add(rectangle.color, "a", 0, 1, 0.01)
	.name("透明度")
	.onChange((/** @type {number} */ val) => {
		rectangle.color.setAlpha(val);
	});
