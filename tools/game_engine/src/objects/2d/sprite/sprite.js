import Object2D from '../base/object2d.js';
import loaderManager from '../../../loader/loader_manager.js';


export default class Sprite extends Object2D {
	constructor(option = {}) {
		super(option);

		this.imageBlocks = option.imageBlocks;
		this._imageBlockIndex = 0;
		this.imageBlock = this.imageBlocks[this._imageBlockIndex];

		this.updateRange = this.updateRange.bind(this);
		this.imageTask = loaderManager.addImage(option.url, true, this.updateRange);

		this.updateMatrix();
		this.updateRange();
	}

	_render(ctx) {
		if (this.imageTask.isLoaded()) {
			ctx.beginPath();
			ctx.drawImage(this.imageTask.image,
				this.imageBlock.x, this.imageBlock.y, this.imageBlock.width, this.imageBlock.height,
				0, 0, this.imageBlock.width, this.imageBlock.height
			);
		}
	}

	get imageBlockIndex() {
		return this._imageBlockIndex;
	}
	set imageBlockIndex(imageBlockIndex) {
		this._imageBlockIndex = imageBlockIndex;
		this.imageBlock = this.imageBlocks[imageBlockIndex];
	}

	updateRange() {
		if (this.imageTask.isLoaded()) {
			this.rectangle.setRectangle(0, 0, this.imageBlock.width, this.imageBlock.height, this.matrixWorld);
		} else {
			this.rectangle.setRectangle(0, 0, 0, 0, this.matrixWorld);
		}
	}

	destroy() {
		super.destroy();

		this.imageBlocks =
			this._imageBlockIndex =
			this.imageBlock =

			this.updateRange =
			this.imageTask = null;

		delete this.imageBlocks;
		delete this._imageBlockIndex;
		delete this.imageBlock;

		delete this.updateRange;
		delete this.imageTask;
	}
}