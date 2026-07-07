import { engine } from "../canvas_engine_examples.module.js";
import { Polygon } from "../../src/render_nodes/2d/polygon/polygon.js";
import { Color } from "../../src/math/color.js";
import { Sprite2D } from "../../src/render_nodes/2d/sprite2d/sprite2d.js";
import { GUI } from "../../../../javascript_libs/lil-gui/dist/lil-gui.esm.js";

// ===== 1. 凸多边形示例：六边形 =====
const hexagonPoints = [];
const radius = 80;
for (let i = 0; i < 6; i++) {
	const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
	hexagonPoints.push({
		x: radius * Math.cos(angle),
		y: radius * Math.sin(angle),
	});
}

const hexagon = new Polygon(hexagonPoints, new Color(0.2, 0.6, 1, 0.8));
hexagon.x = 200;
hexagon.y = 200;
hexagon.centerSelf();
engine.scene.add(hexagon);

// ===== 2. 凹多边形示例：L 形 =====
const lShapePoints = [
	{ x: 0, y: 0 },
	{ x: 150, y: 0 },
	{ x: 150, y: 80 },
	{ x: 80, y: 80 },
	{ x: 80, y: 150 },
	{ x: 0, y: 150 },
];

const lShape = new Polygon(lShapePoints, new Color(1, 0.6, 0.2, 0.8));
lShape.x = 500;
lShape.y = 200;
lShape.centerSelf();
engine.scene.add(lShape);

// ===== 交互：点击改变颜色 =====
hexagon.onMouseDown(() => {
	hexagon.color = new Color(Math.random(), Math.random(), Math.random(), 1);
});
lShape.onMouseDown(() => {
	lShape.color = new Color(Math.random(), Math.random(), Math.random(), 1);
});

// ===== 界面提示 =====
const info1 = Sprite2D.createFromText("点击六边形（凸）改变颜色");
info1.x = 20;
info1.y = 50;
engine.scene.add(info1);

const info2 = Sprite2D.createFromText("点击 L 形（凹）改变颜色");
info2.x = 420;
info2.y = 50;
engine.scene.add(info2);

const desc = Sprite2D.createFromText("Polygon 示例（支持凸凹多边形）");
desc.x = 20;
desc.y = 20;
engine.scene.add(desc);

// ===== GUI 控制 =====
const gui = new GUI({ title: "Polygon 控制" });

// 六边形控制
const hexFolder = gui.addFolder("六边形（凸）");
hexFolder.add(hexagon, "x", -1000, 1000, 1).name("X 位置");
hexFolder.add(hexagon, "y", -1000, 1000, 1).name("Y 位置");
hexFolder.addColor(hexagon.color, "hexString").name("颜色");
hexFolder
	.add(hexagon.color, "a", 0, 1, 0.01)
	.name("透明度")
	.onChange((/** @type {number} */ val) => {
		hexagon.color.setAlpha(val);
	});

// L 形控制
const lFolder = gui.addFolder("L 形（凹）");
lFolder.add(lShape, "x", -1000, 1000, 1).name("X 位置");
lFolder.add(lShape, "y", -1000, 1000, 1).name("Y 位置");
lFolder.addColor(lShape.color, "hexString").name("颜色");
lFolder
	.add(lShape.color, "a", 0, 1, 0.01)
	.name("透明度")
	.onChange((/** @type {number} */ val) => {
		lShape.color.setAlpha(val);
	});
