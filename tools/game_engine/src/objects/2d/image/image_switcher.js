import Object2D from '../base/object2d.js';
import TaskManager from '../../../loader/task_manager.js';

export default class ImageSwitcher extends Object2D {
	constructor(option = {}) {
		super(option);

		this.updateRange = this.updateRange.bind(this);
		this.imageTaskIndex = option.imageTaskIndex || 0;
		this.imageTasks = new TaskManager(this.updateRange).addImageByUrls(option.urls || []);
	}

	updateRange() {
		if (this.imageTasks.isFinish) {
			this.rectangle.setRectangle(0, 0, this.imageTask.width, this.imageTask.height, this.matrixWorld);
		} else {
			this.rectangle.setRectangle(0, 0, 0, 0, this.matrixWorld);
		}
	}

	setImageTaskIndex(index) {
		this.imageTaskIndex = index;
		this.updateRange();
	}

	get imageTask() {
		return this.imageTasks.tasks[this.imageTaskIndex];
	}

	get width() {
		return this.imageTask.width;
	}
	get height() {
		return this.imageTask.height;
	}

	destroy() {
		super.destroy();

		this.updateRange =
			this.imageTaskIndex =
			this.imageTask = null;

		delete this.updateRange;
		delete this.imageTaskIndex;
		delete this.imageTask;
	}
}