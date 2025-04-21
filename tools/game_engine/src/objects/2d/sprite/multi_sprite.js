import Object2D from '../base/object2d.js';
import loaderManager from '../../../loader/loader_manager.js';


export default class MultiSprite extends Object2D {
	constructor(option = {}) {
		super(option);

		this.imageBlocks = option.imageBlocks;
		this.imageBlockIndexes = option._imageBlockIndexes;

		this.drawBlocks = option.drawBlocks || [];

		this.imageTask = loaderManager.addImageByUrl(option.url, true, this.updateRange);
	}

	hitTest() {
		return false;
	}

	destroy() {
		super.destroy();

		this.imageBlocks =
			this.imageBlockIndexes =

			this.drawBlocks =

			this.imageTask = null;

		delete this.imageBlocks;
		delete this.imageBlockIndexes;

		delete this.drawBlocks;

		delete this.imageTask;
	}
}
