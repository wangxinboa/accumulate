import { BigPool } from "../../utils/pool/PoolGroup.js";
import { BatchableSprite } from "./BatchableSprite.js";

const spritePipe = {
	new(renderer) {
		this._gpuSpriteHash = {};
		// this._destroyRenderableBound = this.destroyRenderable.bind(this);
		this._renderer = renderer;
		// this._renderer.renderableGC.addManagedHash(this, "_gpuSpriteHash");
	},
	addRenderable(sprite, instructionSet) {
		const gpuSprite = this._getGpuSprite(sprite);
		if (sprite.didViewUpdate) this._updateBatchableSprite(sprite, gpuSprite);
		this._renderer.renderPipes.batch.addToBatch(gpuSprite, instructionSet);
	},
	updateRenderable(sprite) {
		const gpuSprite = this._gpuSpriteHash[sprite.uid];
		if (sprite.didViewUpdate) this._updateBatchableSprite(sprite, gpuSprite);
		gpuSprite._batcher.updateElement(gpuSprite);
	},
	_updateBatchableSprite(sprite, batchableSprite) {
		batchableSprite.bounds = sprite.visualBounds;
		batchableSprite.texture = sprite._texture;
	},
	_getGpuSprite(sprite) {
		return this._gpuSpriteHash[sprite.uid] || this._initGPUSprite(sprite);
	},
	_initGPUSprite(sprite) {
		const batchableSprite = BigPool.get(BatchableSprite);
		batchableSprite.renderable = sprite;
		batchableSprite.transform = sprite.groupTransform;
		batchableSprite.texture = sprite._texture;
		batchableSprite.bounds = sprite.visualBounds;
		batchableSprite.roundPixels = this._renderer._roundPixels | sprite._roundPixels;
		this._gpuSpriteHash[sprite.uid] = batchableSprite;
		// sprite.on("destroyed", this._destroyRenderableBound);
		return batchableSprite;
	},
};

export default spritePipe;
