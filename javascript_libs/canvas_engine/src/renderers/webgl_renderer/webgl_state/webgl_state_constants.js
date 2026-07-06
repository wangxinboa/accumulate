/**
 * WebGL 混合因子枚举
 * 对应 WebGL 中的 blendFunc 参数
 */
export const GlBlendParamTypeEnum = Object.freeze({
	/** 将所有颜色乘以 0 */
	ZERO: "ZERO",
	/** 将所有颜色乘以 1 */
	ONE: "ONE",
	/** 将源颜色乘以源颜色 */
	SRC_COLOR: "SRC_COLOR",
	/** 将所有颜色与 1 减去每个源颜色相乘 */
	ONE_MINUS_SRC_COLOR: "ONE_MINUS_SRC_COLOR",
	/** 将目标颜色乘以目标颜色 */
	DST_COLOR: "DST_COLOR",
	/** 将所有颜色与 1 减去每个目标颜色相乘 */
	ONE_MINUS_DST_COLOR: "ONE_MINUS_DST_COLOR",
	/** 将源颜色乘以源 alpha 值 */
	SRC_ALPHA: "SRC_ALPHA",
	/** 将所有颜色与 1 减去每个源 alpha 值相乘 */
	ONE_MINUS_SRC_ALPHA: "ONE_MINUS_SRC_ALPHA",
	/** 将目标颜色乘以目标 alpha 值 */
	DST_ALPHA: "DST_ALPHA",
	/** 将所有颜色与 1 减去每个目标 alpha 值相乘 */
	ONE_MINUS_DST_ALPHA: "ONE_MINUS_DST_ALPHA",
	/** 将颜色乘以用户自定义的常量颜色（RGB） */
	CONSTANT_COLOR: "CONSTANT_COLOR",
	/** 将所有颜色与 1 减去用户自定义的常量颜色相乘 */
	ONE_MINUS_CONSTANT_COLOR: "ONE_MINUS_CONSTANT_COLOR",
	/** 将颜色乘以用户自定义的常量透明度 */
	CONSTANT_ALPHA: "CONSTANT_ALPHA",
	/** 将所有颜色与 1 减去用户自定义的常量透明度相乘 */
	ONE_MINUS_CONSTANT_ALPHA: "ONE_MINUS_CONSTANT_ALPHA",
	/** 取源 alpha 和目标 alpha 的较小值（用于抗锯齿） */
	SRC_ALPHA_SATURATE: "SRC_ALPHA_SATURATE",
});

/**
 * WebGL 混合方程枚举
 * 对应 WebGL 中的 blendEquation 参数
 */
export const GlBlendEquationTypeEnum = Object.freeze({
	/** 默认：源 × 因子 + 目标 × 因子（标准叠加） */
	FUNC_ADD: "FUNC_ADD",
	/** 源 × 因子 - 目标 × 因子（变暗） */
	FUNC_SUBTRACT: "FUNC_SUBTRACT",
	/** 目标 × 因子 - 源 × 因子（反向减法） */
	FUNC_REVERSE_SUBTRACT: "FUNC_REVERSE_SUBTRACT",
	/** 取通道最小值（忽略因子） */
	MIN: "MIN",
	/** 取通道最大值（忽略因子） */
	MAX: "MAX",
});
