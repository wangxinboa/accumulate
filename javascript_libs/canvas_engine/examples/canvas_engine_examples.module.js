import { getInitUrlSearchParam } from "../../javascript_utils/javascript_utils.js";
import { Canvas2DEngine } from "../src/canvas_2d_engine.js";
import { StatsTool } from "../../stats.js/stats.js";

export const engine = new Canvas2DEngine({
	container: document.body,
	rendererType: "webgl",
	autoStart: true,
	waitLoadingCompleteStart: false,
	backgroundColor: 0xff0000,
	antialias: true,
});

StatsTool.init();
engine.timeTicker.addRunCallback(function () {
	StatsTool.update();
});

const exampleRelativePaths = [
	"./cameras/camera_coordinate_system.js",
	"./cameras/get_camera_position_example.js",
	"./event/text_mouse_event_example.js",
	"./render_nodes/circle_example.js",
	"./render_nodes/sprite2d_example.js",
	"./render_nodes/text_example.js",
	"./tween/sprite2d_change_position.js",
];

// 1. 获取 URL 中的 exampleId 参数
const exampleId = getInitUrlSearchParam("exampleId");

if (exampleId) {
	const exampleRelativePath = exampleRelativePaths[Number(exampleId)];
	import(exampleRelativePath);
	console.info(`import ${exampleRelativePath}`);
} else {
	throw new Error("exampleId 参数不存在");
}
