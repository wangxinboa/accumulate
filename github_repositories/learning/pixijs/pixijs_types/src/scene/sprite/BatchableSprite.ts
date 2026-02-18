import "../../../../src/scene/sprite/BatchableSprite.mjs";

import { Sprite } from "./Sprite.ts";

export declare class BatchableSprite {
	renderable: Sprite;
	transform: Sprite["groupTransform"];
	texture: Sprite["texture"];
	bounds: Sprite["visualBounds"];
	roundPixels: number;

	packAsQuad: boolean;
}
