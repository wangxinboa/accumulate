import Object2D from "./base/object2d.js";

export default class Circle extends Object2D {
	constructor(scene, option = {}) {
		super(scene, option);

		this.isCircle = true;

		this.radius = option.radius || 1;
		this.startAngle = option.startAngle || 0;
		this.endAngle = option.endAngle || 360;
		this.counterclockwise = option.counterclockwise || false;
	}

	_render(ctx) {
		ctx.beginPath();
		ctx.arc(0, 0, this.radius, this.startAngle * Math.PI / 180, this.endAngle * Math.PI / 180, this.counterClockwise);
	}
}