import { Color } from "../../../math/color.js";
import { BaseCleanUp } from "../../../../../javascript_utils/javascript_utils.js";

export class BackgroundSystem extends BaseCleanUp {
	/** @type {number} */
	alpha;
	/** @type {Color} */
	color;

	static defaultOption = {
		backgroundAlpha: 1,
		backgroundColor: 0,
	};
	/**
	 * @param {CanvasEngineType.BackgroundOption} backgroundOption
	 */
	constructor(backgroundOption) {
		super();

		this.alpha = backgroundOption?.backgroundAlpha ?? BackgroundSystem.defaultOption.backgroundAlpha;
		this.color = Color.createFromHex(
			backgroundOption?.backgroundColor ?? BackgroundSystem.defaultOption.backgroundColor,
		);
	}
}
