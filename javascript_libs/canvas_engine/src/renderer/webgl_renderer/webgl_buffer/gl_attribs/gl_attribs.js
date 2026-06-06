import { BaseCleanUp } from "../../../../../../javascript_utils/javascript_utils.js";
import { GlAttrib } from "./gl_attrib.js";

export class GlAttribs extends BaseCleanUp {
	/** @type {CanvasEngineType.GlAttribsFormat["attribsKey"]} */
	key;
	/** @type {Record<string, CanvasEngineType.GlAttrib>} */
	attribs;
	/** @type {Array<CanvasEngineType.GlAttrib["attribName"]>} */
	attribNames;
	/**
	 * @param {CanvasEngineType.GlAttribsFormat['attribsKey']} attribsKey
	 */
	constructor(attribsKey) {
		super();

		this.key = attribsKey;
		this.attribs = {};
		this.attribNames = [];
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
		if (this.attribs[attribName]) {
			throw new Error(`GlAttribs ${this.key} 已经存在 attrib ${attribName}`);
		}

		this.attribs[attribName] = new GlAttrib(bufferKey, attribName, size, type, normalized, stride, offset);
		this.attribNames.push(attribName);

		return this;
	}

	destroy() {
		for (let i = 0, len = this.attribNames.length; i < len; i++) {
			this.attribs[this.attribNames[i]].destroy();
		}
		super.destroy();
	}
}
