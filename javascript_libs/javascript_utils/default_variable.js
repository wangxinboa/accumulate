/**
 * 默认变量，用于提供占位值，避免空指针异常。
 * ImageData 用于纹理未加载时的临时占位（1x1 像素）。
 */
export const DefaultVariable = {
	ImageData: new ImageData(1, 1),
};
