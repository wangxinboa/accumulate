

export default function WheelMoveCamera2D(dx, dy) {
	this.camera.x += dx;
	this.camera.y -= dy;
}