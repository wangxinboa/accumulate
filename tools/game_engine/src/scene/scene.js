import EventEmitter from '../event/event_emitter.js';
import BaseObject from '../objects/base_object.js';
import WheelMoveCamera from './option_events/wheel_move_camera.js';

export default class Scene extends BaseObject {
	constructor(option) {
		super();

		this.visibleObjects = [];
		this.visibleObjectCount = 0;

		this.camera = option.camera;

		this.directEvent = new EventEmitter();

		if (option.wheelMoveCamera) {
			this.on('wheel', WheelMoveCamera);
		}
	}

	add(object) {
		if (!this.children.includes(object)) {
			this.children.push(object);
			this.sortObjectsByOrder();
		}
		return this;
	}

	addVisibleObject(object) {
		this.visibleObjects[this.visibleObjectCount] = object;
		this.visibleObjectCount++;

		return this;
	}

	clearVisibleObjects() {
		this.visibleObjectCount = 0;
	}

	bindCamera(camera) {
		this.camera = camera;
	}

	destroy() {
		super.destroy();

		for (let i = this.visibleObjects.length - 1; i >= 0; i--) {
			this.visibleObjects.pop();
		}
		this.directEvent.destroy();

		this.visibleObjects =
			this.visibleObjectCount =

			this.camera =
			this.directEvent = null;

		delete this.visibleObjects;
		delete this.visibleObjectCount;

		delete this.camera;
		delete this.directEvent;
	}
}