import Object2D from '../base/object2d.js';
import loaderManager from '../../../loader/loader_manager.js';

let _drawBlock_ = null, _imageBlock_ = null;

export default class MultiSprite extends Object2D {
	constructor(option = {}) {
		super(option);

		this.imageBlocks = option.imageBlocks;
		this.imageBlockIndexes = option._imageBlockIndexes;

		this.drawBlocks = option.drawBlocks || [];

		this.imageTask = loaderManager.addImage(option.url, true, this.updateRange);
	}

	_render(ctx) {
		if (this.imageTask.isLoaded()) {
			ctx.beginPath();
			for (let i = 0, len = this.drawBlocks.length; i < len; i++) {
				_drawBlock_ = this.drawBlocks[i];
				_imageBlock_ = this.imageBlocks[_drawBlock_.imageBlockIndex]
				ctx.drawImage(this.imageTask.image,
					_imageBlock_.x, _imageBlock_.y, _imageBlock_.width, _imageBlock_.height,
					_drawBlock_.x, _drawBlock_.y, _drawBlock_.width, _drawBlock_.height
				);
			}
			_drawBlock_ = null;
		}
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
