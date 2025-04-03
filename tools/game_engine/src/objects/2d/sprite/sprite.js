import Object2D from '../base/object2d.js';
import loaderManager from '../../../loader/loader_manager.js';


export default class Sprite extends Object2D {
	constructor(option = {}) {
		super(option);

		this.blocks = option.blocks;
		this._blockIndex = 0;
		this.block = this.blocks[this._blockIndex];

		this.updateRange = this.updateRange.bind(this);
		this.imageTask = loaderManager.addImage(option.url, true, this.updateRange);

		this.updateMatrix();
		this.updateRange();
	}

	_render(ctx) {
		if (this.imageTask.isLoaded()) {
			ctx.beginPath();
			ctx.drawImage(this.imageTask.image,
				this.block.x, this.block.y, this.block.width, this.block.height,
				0, 0, this.block.width, this.block.height
			);
		}
	}

	get blockIndex() {
		return this._blockIndex;
	}
	set blockIndex(blockIndex) {
		this._blockIndex = blockIndex;
		this.block = this.blocks[blockIndex];
	}

	updateRange() {
		if (this.imageTask.isLoaded()) {
			this.rectangle.setRectangle(0, 0, this.block.width, this.block.height, this.matrixWorld);
		} else {
			this.rectangle.setRectangle(0, 0, 0, 0, this.matrixWorld);
		}
	}

	destroy() {
		super.destroy();

		this.blocks =
			this._blockIndex =
			this.block =

			this.updateRange =
			this.imageTask = null;

		delete this.blocks;
		delete this._blockIndex;
		delete this.block;

		delete this.updateRange;
		delete this.imageTask;
	}
}