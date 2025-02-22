

export default class CanvasEvents {
	constructor(el) {
		this.el = el;

		this.event = this.event.bind(this);

		this.el.addEventListener('mousedown', this.event);
		this.el.addEventListener('mousemove', this.event);
		this.el.addEventListener('mouseup', this.event);
		this.el.addEventListener('mouseleave', this.event);
		this.el.addEventListener('wheel', this.event, { passive: true });

		this.scene = null;
	}

	event(e) {
		let hasEmit = false;
		for (let i = this.scene.visibleObjectCount - 1; i >= 0; i--) {
			if (hasEmit) {
				break;
			} else {
				hasEmit = this.scene.visibleObjects[i].emit(e.type, e, this.scene.camera);
			}
		}
		if (!hasEmit) {
			this.scene.emit(e.type, e, this.scene.camera);
		}
		hasEmit = null;
	}

	bindScene(scene) {
		this.scene = scene;
	}

	destroy() {
		this.el.removeEventListener('mousedown', this.event);
		this.el.removeEventListener('mousemove', this.event);
		this.el.removeEventListener('mouseup', this.event);
		this.el.removeEventListener('mouseleave', this.event);
		this.el.removeEventListener('wheel', this.event);

		this.el = null;
		this.event = null;

		this.scene = null;
	}
}