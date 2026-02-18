import "../../../../src/scene/sprite/SpritePipe.mjs";

import { BatchableSprite } from "./BatchableSprite.ts";
import { Sprite } from "./Sprite.ts";

export declare class SpritePipe {
	_gpuSpriteHash: Record<Sprite["uid"], BatchableSprite>;
}
