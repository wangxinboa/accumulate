import "../../../../../../src/rendering/renderers/shared/shader/UniformGroup.mjs";

export declare class UniformGroup {
	uniformStructures: Record<
		string,
		{
			name: string;
			size: number;
			type: string;
			value: any;
		}
	>;
	/** uniformStructures 对应 key 的 value */
	uniforms: Record<string, any>;

	isStatic: boolean;
	ubo: boolean;
	_signature: number;
}
