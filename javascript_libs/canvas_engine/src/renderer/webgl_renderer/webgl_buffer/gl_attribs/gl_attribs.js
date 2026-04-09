import { BaseCleanUp } from "../../../../../../javascript_utils/javascript_utils.js";
import { GlAttrib } from "./gl_attrib.js";

export class GlAttribs extends BaseCleanUp {
	/** @type {CanvasEngineType.GlAttribsFormat["arrtibsKey"]} */
	key;
	/** @type {Record<string, CanvasEngineType.GlAttrib>} */
	arrtibs;
	/** @type {Array<CanvasEngineType.GlAttrib["attribName"]>} */
	arrtibNames;
	/**
	 * @param {CanvasEngineType.GlAttribsFormat} glAttribsFormat
	 */
	constructor(glAttribsFormat) {
		super();

		this.key = glAttribsFormat.arrtibsKey;
		this.arrtibs = {};
		this.arrtibNames = [];

		for (let i = 0, len = glAttribsFormat.arrtibs.length; i < len; i++) {
			const glAttribFormat = glAttribsFormat.arrtibs[i];

			this.arrtibs[glAttribFormat.attribName] = new GlAttrib(glAttribFormat);
			this.arrtibNames.push(glAttribFormat.attribName);
		}
	}

	destroy() {
		for (let i = 0, len = this.arrtibNames.length; i < len; i++) {
			this.arrtibs[this.arrtibNames[i]].destroy();
		}
		super.destroy();
	}
}
