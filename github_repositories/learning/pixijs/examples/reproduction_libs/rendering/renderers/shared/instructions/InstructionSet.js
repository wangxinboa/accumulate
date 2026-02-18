import { uid } from "../../../../utils/data/uid.js";

class InstructionSet {
	constructor() {
		this.uid = uid("instructionSet");

		this.instructions = [];

		this.instructionSize = 0;
		this.renderables = [];

		this.gcTick = 0;
	}
	reset() {
		this.instructionSize = 0;
	}
	add(instruction) {
		this.instructions[this.instructionSize++] = instruction;
	}
	log() {
		this.instructions.length = this.instructionSize;
		console.table(this.instructions, ["type", "action"]);
	}
}

export { InstructionSet };
