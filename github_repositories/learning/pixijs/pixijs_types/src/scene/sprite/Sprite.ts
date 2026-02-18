import "../../../../src/scene/sprite/Sprite.mjs";

import { BoundsData } from "../../../../src/scene/container/bounds/Bounds";
import { Container } from "../container/Container.ts";
import { Texture } from "../../texture/Texture.ts";

export declare class Sprite extends Container {
	renderPipeId: "sprite";

	_texture: Texture;
	set texture(value: Sprite["_texture"]);
	get texture(): Texture;

	private readonly _visualBounds: BoundsData;
	get visualBounds(): BoundsData;
}
