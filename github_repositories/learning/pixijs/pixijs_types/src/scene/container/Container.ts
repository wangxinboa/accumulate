import "../../../../src/scene/container/Container.mjs";

import { Matrix } from "../../../../src/maths/matrix/Matrix.mjs";
import { ObservablePoint } from "../../../../src/maths/point/ObservablePoint.mjs";
import { RenderGroup } from "./RenderGroup.ts";

export declare class Container {
	readonly uid: number;

	didViewUpdate: boolean;

	renderGroup: RenderGroup;
	groupTransform: Matrix;
	isSimple: boolean;

	sortableChildren: boolean;

	_didContainerChangeTick: number;
	_didLocalTransformChangeId: number;

	localTransform: Matrix;
	_scale: ObservablePoint;
	_pivot: ObservablePoint;
	_position: ObservablePoint;
}
