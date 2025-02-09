

export default class CanvasEvents {
	constructor(el) {
		this.el = el;

		this.event = this.event.bind(this);

		this.el.addEventListener('mousedown', this.event);
		this.el.addEventListener('mousemove', this.event);
		this.el.addEventListener('mouseup', this.event);
		this.el.addEventListener('mouseleave', this.event);
		this.el.addEventListener('wheel', this.event, { passive: true });

		this.scenes = new Map();
	}

	event(e) {
		this.scenes.forEach((camera, scene) => {
			let hasEmit = false;
			for (let [object] of scene.visibleObjectsMap) {
				if (hasEmit) {
					break;
				} else {
					hasEmit = object.emit(e.type, object, e, camera);
				}
			}
			if (!hasEmit) {
				scene.emit(e.type, scene, e, camera);
			}
		});
	}

	addScene(scene, camera) {
		if (!this.scenes.has(scene)) {
			this.scenes.set(scene, camera);
		}
	}

	removeScene(scene) {
		if (this.scenes.has(scene)) {
			this.scenes.delete(scene, camera);
		}
	}

	destroy() {
		this.el.removeEventListener('mousedown', this.event);
		this.el.removeEventListener('mousemove', this.event);
		this.el.removeEventListener('mouseup', this.event);
		this.el.removeEventListener('mouseleave', this.event);
		this.el.removeEventListener('wheel', this.event);

		this.el = null;
		this.event = null;

		this.scenes.clear();
		this.scenes = null;
	}
}