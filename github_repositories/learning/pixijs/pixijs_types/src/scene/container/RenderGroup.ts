import "../../../../src/scene/container/RenderGroup.mjs";

import { Matrix } from "../../../../src/maths/matrix/Matrix.mjs";
import { InstructionSet } from "../../rendering/renderers/shared/instructions/InstructionSet.ts";
import { Container } from "./Container.ts";

export declare class RenderGroup {
	renderPipeId: "renderGroup";
	instructionSet: InstructionSet;

	structureDidChange: boolean;

	worldTransform: Matrix;
	worldColor: number;
	worldAlpha: number;
	worldColorAlpha: number;

	childrenRenderablesToUpdate: {
		index: number;
	};
	childrenToUpdate: Record<
		number,
		{
			index: number;
			list: Array<Container>;
		}
	>;
}
