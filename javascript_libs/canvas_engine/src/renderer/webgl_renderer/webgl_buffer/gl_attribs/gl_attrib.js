import { BaseCleanUp } from "../../../../../../javascript_utils/javascript_utils.js";

export class GlAttrib extends BaseCleanUp {
	/** @type {CanvasEngineType.GlAttribFormat["bufferKey"]} */
	bufferKey;
	/** @type {CanvasEngineType.GlAttribFormat["attribName"]} */
	attribName;
	/** @type {CanvasEngineType.GlAttribFormat["size"]} */
	size;
	/** @type {CanvasEngineType.GlAttribFormat["type"]} */
	type;
	/** @type {CanvasEngineType.GlAttribFormat["normalized"]} */
	normalized;
	/** @type {CanvasEngineType.GlAttribFormat["stride"]} */
	stride;
	/** @type {CanvasEngineType.GlAttribFormat["offset"]} */
	offset;
	/**
	 * @param {CanvasEngineType.GlAttribFormat['bufferKey']} bufferKey
	 * @param {CanvasEngineType.GlAttribFormat['attribName']} attribName
	 * @param {CanvasEngineType.GlAttribFormat['size']} size
	 * @param {CanvasEngineType.GlAttribFormat['type']} type
	 * @param {CanvasEngineType.GlAttribFormat['normalized']} normalized
	 * @param {CanvasEngineType.GlAttribFormat['stride']} stride
	 * @param {CanvasEngineType.GlAttribFormat['offset']} offset
	 */
	constructor(bufferKey, attribName, size, type, normalized, stride, offset) {
		super();

		this.bufferKey = bufferKey;
		this.attribName = attribName;
		this.size = size;
		this.type = type;
		this.normalized = normalized;
		this.stride = stride;
		this.offset = offset;
	}
}
