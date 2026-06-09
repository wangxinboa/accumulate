export const GlBufferTargetTypeEnum = Object.freeze({
	ARRAY_BUFFER: "ARRAY_BUFFER",
	ELEMENT_ARRAY_BUFFER: "ELEMENT_ARRAY_BUFFER",
	// webgl2
	COPY_READ_BUFFER: "COPY_READ_BUFFER",
	COPY_WRITE_BUFFER: "COPY_WRITE_BUFFER",
	TRANSFORM_FEEDBACK: "TRANSFORM_FEEDBACK",
	UNIFORM_BUFFER: "UNIFORM_BUFFER",
	PIXEL_PACK_BUFFER: "PIXEL_PACK_BUFFER",
	PIXEL_UNPACK_BUFFER: "PIXEL_UNPACK_BUFFER",
});

export const GlBufferUsageTypeEnum = Object.freeze({
	STATIC_DRAW: "STATIC_DRAW",
	DYNAMIC_DRAW: "DYNAMIC_DRAW",
	STREAM_DRAW: "STREAM_DRAW",
	// webgl2
});

export const GlBufferDataTypeEnum = Object.freeze({
	BYTE: "BYTE",
	SHORT: "SHORT",
	UNSIGNED_BYTE: "UNSIGNED_BYTE",
	UNSIGNED_SHORT: "UNSIGNED_SHORT",
	FLOAT: "FLOAT",
	// webgl2
	HALF_FLOAT: "HALF_FLOAT",
});

export const GetTextureBufferTypeEnum = Object.freeze({
	/** render node 的 texture buffer 根据 key 来获取, 如果 key 一样, texture 有变化的话, 就 bufferSubData 更新原来的 buffer */
	fromTextureKey: "fromTextureKey",
	/** render node 的 texture buffer 根据 width height 来获取, 不一样的话, 就创建一个新的 Buffer */
	fromTextureWidthAndHeight: "fromTextureWidthAndHeight",
});
