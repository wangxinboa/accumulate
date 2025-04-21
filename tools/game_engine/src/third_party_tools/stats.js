import Stats from '../../../../javascript_libs/stats.js/build/stats.module.js';

const StatsTool = {
	stats: null,
	init() {
		StatsTool.stats = new Stats();
		StatsTool.stats.domElement.style.position = 'absolute';
		StatsTool.stats.domElement.style.top = 'initial';
		StatsTool.stats.domElement.style.bottom = '0px';
		StatsTool.stats.domElement.style.height = 'fit-content';
		document.body.appendChild(StatsTool.stats.domElement);
	},
	update() {
		StatsTool.stats.update();
	}
};

export default StatsTool;