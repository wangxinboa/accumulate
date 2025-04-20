import EventEmitter from '../event/event_emitter.js';
import RootObject from '../objects/root_object.js';
import WheelMoveCamera2D from './option_events/wheel_move_camera2d.js';

export default class Scene extends EventEmitter {
	constructor(option) {
		super();

		this.root = new RootObject();

		this.visibleObjects = [];
		this.visibleObjectCount = 0;

		this.camera = option.camera;

		this.directEvent = new EventEmitter();

		if (option.wheelMoveCamera) {
			this.on('wheel', WheelMoveCamera2D);
		}
	}

	add(object) {
		this.root.add(object);

		return this;
	}

	remove(object) {
		this.root.remove(object);

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

		this.root.destroy();

		for (let i = this.visibleObjects.length - 1; i >= 0; i--) {
			this.visibleObjects.pop();
		}
		this.directEvent.destroy();

		this.root =

			this.visibleObjects =
			this.visibleObjectCount =

			this.camera =
			this.directEvent = null;

		delete this.root;

		delete this.visibleObjects;
		delete this.visibleObjectCount;

		delete this.camera;
		delete this.directEvent;
	}
}