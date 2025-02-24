import Scene from './scene.js';


export default class Scene2D extends Scene {
	constructor() {
		super();

	}

	render(ctx) {
		this.clearVisibleObjects();

		this.camera.transform(ctx);

		let object = null;
		for (let i = 0, len = this.objects.length; i < len; i++) {
			object = this.objects[i];
			if (object.visible && object.isOverlap(this.camera)) {
				object.render(ctx);
				this.addVisibleObject(object);
			}
		}
		object = null;
	}
}