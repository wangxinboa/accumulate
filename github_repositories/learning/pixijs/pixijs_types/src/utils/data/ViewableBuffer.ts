import "../../../../src/utils/data/ViewableBuffer.mjs";

export declare class ViewableBuffer {
	rawBinaryData: ArrayBuffer;

	uint32View: Uint32Array;
	float32View: Float32Array;
	size: number;
}
