import { engine } from "../canvas_engine_examples.module.js";
import { Polygon } from "../../src/render_nodes/2d/polygon/polygon.js";
import { Color } from "../../src/math/color.js";
import { Sprite2D } from "../../src/render_nodes/2d/sprite2d/sprite2d.js";
import { GUI } from "../../../../javascript_libs/lil-gui/dist/lil-gui.esm.js";
import { Circle } from "../../src/render_nodes/2d/circle/circle.js";
import { disableHitTest } from "../test_tools/hit_test/hit_test.js";

disableHitTest();

// ===== 1. 凸多边形示例：六边形（扁平坐标数组） =====
const hexagonPoints = [];
const radius = 80;
for (let i = 0; i < 6; i++) {
	const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
	hexagonPoints.push(radius * Math.cos(angle), radius * Math.sin(angle));
}

const hexagon = new Polygon(hexagonPoints, new Color(0.2, 0.6, 1, 0.8));
hexagon.x = 200;
hexagon.y = 200;
engine.scene.add(hexagon);

// ===== 2. 凹多边形示例：L 形（扁平坐标数组） =====
const lShapePoints = [0, 0, 150, 0, 150, 80, 80, 80, 80, 150, 0, 150];

const lShape = new Polygon(lShapePoints, new Color(1, 0.6, 0.2, 0.8));
lShape.x = 500;
lShape.y = 200;
engine.scene.add(lShape);

// ===== 交互：点击改变颜色 =====
hexagon.addMouseDownEvent(() => {
	hexagon.color = new Color(Math.random(), Math.random(), Math.random(), 1);
});
lShape.addMouseDownEvent(() => {
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

// ===== 动态添加多边形（新增功能） =====
let isAdding = false; // 是否处于添加模式
/** @type {number[]} */
let customPoints = [];
const customPolygon = new Polygon([], new Color(Math.random(), Math.random(), Math.random(), 0.8)); // 正在构建的多边形
customPolygon.hitTestDisabled = true; // 避免干扰
engine.scene.add(customPolygon);

// 创建临时指示点（一个小圆）
const tempCircle = new Circle(4, new Color(0, 0, 0, 0.8));
tempCircle.centerSelf();
tempCircle.hitTestDisabled = true; // 不阻挡点击
tempCircle.visible = false;
engine.scene.add(tempCircle);

// 绑定场景事件（一直在，但通过 isAdding 控制）
engine.scene.addMouseDownEvent((_node, x, y) => {
	console.clear();
	if (!isAdding) {
		return;
	}

	customPoints.pop();
	customPoints.pop();
	// 添加当前鼠标位置作为新顶点
	customPoints.push(x, y);
	customPolygon.setPoints(customPoints);
	customPoints.push(x, y);
});
engine.scene.addMouseMoveEvent((_node, x, y) => {
	if (!isAdding) {
		return;
	}

	// 更新临时点位置
	tempCircle.x = x;
	tempCircle.y = y;
	tempCircle.visible = true;

	// 将多边形的最后一个顶点设为当前鼠标位置（预览）
	if (customPoints.length > 2) {
		// 最后一个顶点是当前鼠标位置，之前顶点不变
		customPoints[customPoints.length - 2] = x;
		customPoints[customPoints.length - 1] = y;
		customPolygon.setPoints(customPoints);
	}

	console.info("customPolygon.points", customPolygon.points);
	console.info("customPolygon.geometry.triangles", customPolygon.geometry.triangles);
});

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

// 动态添加控制
const addFolder = gui.addFolder("动态添加多边形");
addFolder
	.add(
		{
			start: () => {
				isAdding = true;
				tempCircle.visible = false;
				console.log("开始添加多边形，点击场景添加顶点");
			},
		},
		"start",
	)
	.name("开始添加");

addFolder
	.add(
		{
			stop: () => {
				isAdding = false;
				tempCircle.visible = false;
				if (customPolygon) {
					const count = customPolygon.points.length / 2;
					if (count < 3) {
						// 顶点太少，移除多边形
						engine.scene.remove(customPolygon);
						console.log("顶点少于3个，已移除");
					} else {
						customPoints.pop();
						customPoints.pop();

						customPolygon.setPoints(customPoints);
						// 完成多边形，使其可交互
						customPolygon.hitTestDisabled = false;
						console.log(`完成多边形，顶点数 ${count}`);
					}
				}
			},
		},
		"stop",
	)
	.name("结束添加");
