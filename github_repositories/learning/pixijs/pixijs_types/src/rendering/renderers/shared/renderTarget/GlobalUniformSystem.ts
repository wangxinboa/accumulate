import "../../../../../../src/rendering/renderers/shared/renderTarget/GlobalUniformSystem.mjs";

import { Matrix } from "../../../../../../src/maths/matrix/Matrix.mjs";
import { PointData } from "../../../../../../src/maths/point/PointData";
import { UniformGroup } from "../shader/UniformGroup.ts";
import { BindGroup } from "../../gpu/shader/BindGroup.ts";

export interface GlobalUniformData {
	projectionMatrix: Matrix;
	worldTransformMatrix: Matrix;
	worldColor: number;
	resolution: number[];
	offset: PointData;
	bindGroup: BindGroup;
}

export declare class GlobalUniformSystem {
	_stackIndex: number;
	_globalUniformDataStack: GlobalUniformData[];
	_currentGlobalUniformData: GlobalUniformData;
	_uniformsPool: UniformGroup[];
	_activeUniforms: UniformGroup[];
	_bindGroupPool: BindGroup[];
	_activeBindGroups: BindGroup[];
}
