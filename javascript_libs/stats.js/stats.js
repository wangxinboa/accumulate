import Stats from "./build/stats.module.js";

export const StatsTool = {
	stats: new Stats(),
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
