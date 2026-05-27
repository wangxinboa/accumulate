import { BaseCleanUp } from "../../../../../../javascript_utils/javascript_utils.js";
import { GlAttrib } from "./gl_attrib.js";

export class GlAttribs extends BaseCleanUp {
	/** @type {CanvasEngineType.GlAttribsFormat["attribsKey"]} */
	key;
	/** @type {Record<string, CanvasEngineType.GlAttrib>} */
	arrtibs;
	/** @type {Array<CanvasEngineType.GlAttrib["attribName"]>} */
	arrtibNames;
	/**
	 * @param {CanvasEngineType.GlAttribsFormat['attribsKey']} attribsKey
	 */
	constructor(attribsKey) {
		super();

		this.key = attribsKey;
		this.arrtibs = {};
		this.arrtibNames = [];
	}

	/**
	 * @param {CanvasEngineType.GlAttribFormat['bufferKey']} bufferKey
	 * @param {CanvasEngineType.GlAttribFormat['attribName']} attribName
	 * @param {CanvasEngineType.GlAttribFormat['size']} size
	 * @param {CanvasEngineType.GlAttribFormat['type']} type
	 * @param {CanvasEngineType.GlAttribFormat['normalized']} normalized
	 * @param {CanvasEngineType.GlAttribFormat['stride']} stride
	 * @param {CanvasEngineType.GlAttribFormat['offset']} offset
	 */
	addAttrib(bufferKey, attribName, size, type, normalized, stride, offset) {
		this.arrtibs[attribName] = new GlAttrib(bufferKey, attribName, size, type, normalized, stride, offset);
		this.arrtibNames.push(attribName);

		return this;
	}

	destroy() {
		for (let i = 0, len = this.arrtibNames.length; i < len; i++) {
			this.arrtibs[this.arrtibNames[i]].destroy();
		}
		super.destroy();
	}
}
