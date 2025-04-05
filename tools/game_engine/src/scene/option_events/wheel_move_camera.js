

export default function WheelMoveCamera(dx, dy) {
	this.camera.x += dx;
	this.camera.y -= dy;
}