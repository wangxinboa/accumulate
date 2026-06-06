import { getInitUrlSearchParam } from "../../javascript_utils/javascript_utils.js";
import { Canvas2DEngine } from "../src/canvas_2d_engine.js";
import Stats from "../../../javascript_libs/stats.js/build/stats.module.js";

const StatsTool = {
	stats: new /** @type {any} */ (Stats)(),
	init() {
		StatsTool.stats.domElement.style.position = "absolute";
		StatsTool.stats.domElement.style.top = "initial";
		StatsTool.stats.domElement.style.bottom = "0px";
		StatsTool.stats.domElement.style.height = "fit-content";
		document.body.appendChild(StatsTool.stats.domElement);
	},
	update() {
		StatsTool.stats.update();
	},
};
StatsTool.init();
globalThis.StatsTool = StatsTool;

export const engine = new Canvas2DEngine({
	container: document.body,
	rendererType: "webgl",
	autoStart: true,
	waitLoadingCompleteStart: true,
	backgroundColor: 0xff0000,
});

engine.timeTicker.addRunCallback(function () {
	StatsTool.update();
});

globalThis.engine = engine;

const exampleRelativePath = [
	"./camera/get_camera_position_example.js",
	"./event/text_mouse_event_example.js",
	"./render_node/sprite_two_texture/sprite_two_texture_example.js",
	"./render_node/sprite2d_change_texture_example.js",
	"./render_node/sprite2d_text_example.js",
	"./render_node/sprite2d_example.js",
	"./render_node/text_example.js",
];

// 1. 获取 URL 中的 exampleId 参数
const exampleId = getInitUrlSearchParam("exampleId");

if (exampleId) {
	import(exampleRelativePath[Number(exampleId)]);
} else {
	throw new Error("exampleId 参数不存在");
}
