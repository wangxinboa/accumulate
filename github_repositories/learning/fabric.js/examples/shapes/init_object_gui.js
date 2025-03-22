
export default function initObjectGui(gui, object, canvas) {
	const folder = gui.addFolder('object');
	const onChangeFun = () => {
		canvas.renderAll();
	}
	// 公共
	folder.add(object, 'originX', {
		left: 'left',
		center: 'center',
		right: 'right',
	}).onChange(onChangeFun);
	folder.add(object, 'originY', {
		top: 'top',
		center: 'center',
		bottom: 'bottom',
	}).onChange(onChangeFun);
	folder.add(object, 'top', 0, 500, 1).onChange(onChangeFun);
	folder.add(object, 'left', 0, 500, 1).onChange(onChangeFun);
	folder.add(object, 'width', 0, 500, 1).onChange(onChangeFun);
	folder.add(object, 'height', 0, 500, 1).onChange(onChangeFun);
	folder.add(object, 'scaleX', 0, 10, 0.1).onChange(onChangeFun);
	folder.add(object, 'scaleY', 0, 10, 0.1).onChange(onChangeFun);
	folder.add(object, 'flipX').onChange(onChangeFun);
	folder.add(object, 'flipY', 0, 1).onChange(onChangeFun);
	folder.add(object, 'opacity', 0, 1, 0.01).onChange(onChangeFun);
	folder.add(object, 'angle', -180, 180, 1).onChange(onChangeFun);
	folder.add(object, 'cornerSize', 0, 100).onChange(onChangeFun);
	folder.add(object, 'transparentCorners').onChange(onChangeFun);
	folder.add(object, 'padding', -100, 100).onChange(onChangeFun);
	folder.addColor(object, 'borderColor').onChange(onChangeFun);
	folder.addColor(object, 'cornerColor').onChange(onChangeFun);
	folder.addColor(object, 'fill').onChange(onChangeFun);
	folder.add(object, 'fillRule', {
		"source-over": "source-over",
		"source-in": "source-in",
		"source-out": "source-out",
		"source-atop": "source-atop",
		"destination-over": "destination-over",
		"destination-in": "destination-in",
		"destination-out": "destination-out",
		"destination-atop": "destination-atop",
		"lighter": "lighter",
		"copy": "copy",
		"xor": "xor",
		"multiply": "multiply",
		"screen": "screen",
		"overlay": "overlay",
		"darken": "darken",
		"lighten": "lighten",
		"color-dodge": "color-dodge",
		"color-burn": "color-burn",
		"hard-light": "hard-light",
		"soft-light": "soft-light",
		"difference": "difference",
		"exclusion": "exclusion",
		"hue": "hue",
		"saturation": "saturation",
		"color": "color",
		"luminosity": "luminosity",
	}).onChange(onChangeFun);
	object.overlayFill = '#000000';
	folder.addColor(object, 'overlayFill').onChange(onChangeFun);
	object.stroke = '#000000';
	folder.addColor(object, 'stroke').onChange(onChangeFun);
	folder.add(object, 'strokeWidth', 0, 30, 1).onChange(onChangeFun);
	// strokeDashArray
	// shadow
	folder.add(object, 'borderOpacityWhenMoving', 0, 1, 0.01).onChange(onChangeFun);
	folder.add(object, 'borderScaleFactor', -10, 10, 0.1).onChange(onChangeFun);
	// transformMatrix
	folder.add(object, 'minScaleLimit', -10, 10, 0.1).onChange(onChangeFun);
	folder.add(object, 'selectable').onChange(onChangeFun);
	folder.add(object, 'visible').onChange(onChangeFun);
	folder.add(object, 'hasControls').onChange(onChangeFun);
	folder.add(object, 'hasBorders').onChange(onChangeFun);
	// folder.add(object, 'hasRotatingPoint').onChange(onChangeFun);
	// folder.add(object, 'rotatingPointOffset', 0, 100).onChange(onChangeFun);
	folder.add(object, 'perPixelTargetFind').onChange(onChangeFun);
	folder.add(object, 'includeDefaultValues').onChange(onChangeFun);
	// clipTo
}