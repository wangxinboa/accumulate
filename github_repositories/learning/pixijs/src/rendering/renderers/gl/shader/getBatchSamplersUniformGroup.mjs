import { UniformGroup } from "../../shared/shader/UniformGroup.mjs";

("use strict");
/** @type {Record<string, PixijsType.UniformGroup>} */
const batchSamplersUniformGroupHash = {};
/**
 * @param {number} maxTextures
 */
function getBatchSamplersUniformGroup(maxTextures) {
	let batchSamplersUniformGroup = batchSamplersUniformGroupHash[maxTextures];
	if (batchSamplersUniformGroup) return batchSamplersUniformGroup;
	const sampleValues = new Int32Array(maxTextures);
	for (let i = 0; i < maxTextures; i++) {
		sampleValues[i] = i;
	}
	batchSamplersUniformGroup = batchSamplersUniformGroupHash[maxTextures] = new UniformGroup(
		{
			uTextures: { value: sampleValues, type: `i32`, size: maxTextures },
		},
		{ isStatic: true },
	);
	return batchSamplersUniformGroup;
}

export { getBatchSamplersUniformGroup };
//# sourceMappingURL=getBatchSamplersUniformGroup.mjs.map
