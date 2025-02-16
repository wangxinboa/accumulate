import { scene } from "./start2d.js";

let x = 0, y = 0, selectedObject = false;

export function allowObject2dCanMove(scene) {
	scene.on('mousemove', function (e) {
		if (selectedObject) {
			selectedObject.x += e.offsetX - x;
			selectedObject.y += e.offsetY - y;
			x = e.offsetX;
			y = e.offsetY;

		}
	});
	scene.on('mouseup', function () {
		if (selectedObject) {
			selectedObject.renderOrder = 0;
			scene.sortObjectsByOrder();
			selectedObject = null;
		}
	});
}

export function object2dMoveFun(e) {
	x = e.offsetX;
	y = e.offsetY;
	selectedObject = this;

	selectedObject.renderOrder = 1;
	scene.sortObjectsByOrder();
}

export function object2dCanMove(object2d) {
	object2d.on('mousedown', object2dMoveFun);
}