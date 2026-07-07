import { getCircleFromPool, recycleCircleToPool } from "./hit_test_circle_pool.js";
import { getRectFromPool, recycleRectToPool } from "./hit_test_rect_pool.js";
import { engine } from "../../canvas_engine_examples.module.js";

// ===== 模块级状态变量（所有函数共享） =====
/** @type {CanvasEngineType.Canvas2DEngine["eventSystem"]["activeEvent"] | null} */
let activeEvent = null;

let isDrawing = false;
let startX = 0;
let startY = 0;
/** @type {CanvasEngineType.Rectangle | null} */
let selectionRect = null;
/** @type {Array<CanvasEngineType.Circle>} */
const hitCircles = [];

// ===== 事件处理函数（单独抽离） =====
/**
 * 鼠标按下处理
 * @param {CanvasEngineType.RenderEventNode} _node
 * @param {number} x
 * @param {number} y
 */
function handleMouseDown(_node, x, y) {
	if (isDrawing) return;
	isDrawing = true;
	startX = x;
	startY = y;

	// 清空之前标注的命中点（回收所有 Circle）
	for (let i = 0; i < hitCircles.length; i++) {
		recycleCircleToPool(hitCircles[i]);
	}
	hitCircles.length = 0;

	// 从池中获取矩形选择框
	selectionRect = getRectFromPool();
	selectionRect.x = startX;
	selectionRect.y = startY;
	engine.scene.add(selectionRect);
}

/**
 * 鼠标移动处理
 * @param {CanvasEngineType.RenderEventNode} _node
 * @param {number} x
 * @param {number} y
 */
function handleMouseMove(_node, x, y) {
	if (!isDrawing || !selectionRect) return;

	const minX = Math.min(startX, x);
	const minY = Math.min(startY, y);
	const width = Math.abs(startX - x);
	const height = Math.abs(startY - y);

	selectionRect.x = minX;
	selectionRect.y = minY;
	selectionRect.width = Math.max(width, 1);
	selectionRect.height = Math.max(height, 1);
}

/**
 * 鼠标抬起处理
 * @param {CanvasEngineType.RenderEventNode} _node
 * @param {number} x
 * @param {number} y
 */
function handleMouseUp(_node, x, y) {
	if (!isDrawing || !selectionRect) return;
	isDrawing = false;

	const minX = Math.min(startX, x);
	const maxX = Math.max(startX, x);
	const minY = Math.min(startY, y);
	const maxY = Math.max(startY, y);

	// 移除并回收矩形选择框
	engine.scene.remove(selectionRect);
	recycleRectToPool(selectionRect);
	selectionRect = null;

	// 遍历矩形区域内的每个像素点，使用引擎的碰撞检测进行命中测试
	const step = 1; // 步长，可根据需要调整（例如 2 或 3 以提高性能）
	for (let px = minX; px <= maxX; px += step) {
		for (let py = minY; py <= maxY; py += step) {
			// hitTestPoint 内部会自动转换坐标（包括相机变换和设备像素比）
			if (activeEvent && activeEvent.hitTestPointInCamera(px, py)) {
				const circle = getCircleFromPool();
				circle.x = px;
				circle.y = py;
				engine.scene.add(circle);
				hitCircles.push(circle);
			}
		}
	}
	console.info(`Hit test complete. Total hit points: ${hitCircles.length}`);
}

/**
 * 初始化点击测试工具
 */
export function initHitTest() {
	activeEvent = engine.eventSystem.activeEvent;

	// 注册事件（使用已抽离的函数）
	engine.scene.onMouseDown(handleMouseDown);
	engine.scene.onMouseMove(handleMouseMove);
	engine.scene.onMouseUp(handleMouseUp);
}
