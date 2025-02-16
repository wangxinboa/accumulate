import {
	Camera2d,
	CanvasRender,
	Scene,
	CanvasEvents,
	Polyline, Text, Circle,
} from '../../../game_engine/src/index.js';

const camera = new Camera2d();
const scene = new Scene();

let renderer = null;
let canvasEvents = null;

let x = 0, y = 0, allowMove = false;
scene.on('mousedown', function (e) {
	x = e.offsetX;
	y = e.offsetY;
	allowMove = true;
});
scene.on('mousemove', function (e, camera) {
	if (allowMove) {
		camera.x += x - e.offsetX;
		camera.y += y - e.offsetY;
		x = e.offsetX;
		y = e.offsetY;
	}
});
scene.on('mouseup', function () {
	allowMove = false;
});
scene.on('wheel', function (e, camera) {
	camera.x += e.deltaX;
	camera.y += e.deltaY;
});

let afterRender = null;
function animationFrame() {
	requestAnimationFrame(animationFrame);
	renderer.render(scene, camera);
	if (afterRender) {
		afterRender();
	}
}

export function startCodeAnalysisUiCanvasDraw(canvasDom) {
	renderer = new CanvasRender(canvasDom, {
		backgroundColor: '#ffffff',
		maxWidth: 900,
		onResize(width, height) {
			camera.setRange(width, height);
		}
	});

	canvasEvents = new CanvasEvents(canvasDom);
	canvasEvents.addScene(scene, camera);

	animationFrame();
}

const AllMarkNodeObject2d = new Map();

function eachBefore(root, callback) {
	let node = root, nodes = [root], children, i, index = -1;
	while (node = nodes.pop()) {
		callback(node, ++index);
		if (children = node.children) {
			for (i = children.length - 1; i >= 0; --i) {
				nodes.push(children[i]);
			}
		}
	}
	return this;
}

function initMarkNodeObject2d(markNode, index) {
	let markNodeObject2d = null, parentMarkNodeObject2d = null;
	if (markNode.parent) {
		parentMarkNodeObject2d = AllMarkNodeObject2d.get(markNode.parent);
	}

	if (AllMarkNodeObject2d.has(markNode)) {
		markNodeObject2d = AllMarkNodeObject2d.get(markNode);
	} else {
		markNodeObject2d = {
			depth: parentMarkNodeObject2d ? parentMarkNodeObject2d.depth + 1 : 0,
			index,
			text: new Text({
				x: 0,
				y: 0,
				text: markNode.title,
				fontSize: 14,
				fill: '#000000',
			}),
			circle: new Circle({
				x: 0, y: 0, radius: 2.5,
				fill: Array.isArray(markNode.children) && markNode.children.length > 0 ? '#000000' : '#999999',
				renderOrder: 1,
			}),
			polyline: markNode.parent ? new Polyline({
				points: [
					{ x: 0, y: 0 },
					{ x: 0, y: 0 },
					{ x: 0, y: 0 },
				],
				strokeWidth: 1,
				stroke: Array.isArray(markNode.children) && markNode.children.length > 0 ? '#000000' : '#999999',
				fill: null,
			}) : null,
		};

		scene.addObject(markNodeObject2d.text);
		scene.addObject(markNodeObject2d.circle);
		if (markNodeObject2d.polyline) {
			scene.addObject(markNodeObject2d.polyline);
		}

		AllMarkNodeObject2d.set(markNode, markNodeObject2d);
	}
	markNodeObject2d.index = index++;
}

const nodeSize = 20, startX = 4, startY = 4;

function dealMarkNodeObject2d(markNode) {
	let markNodeObject2d = AllMarkNodeObject2d.get(markNode);

	markNodeObject2d.text.x = startX + markNodeObject2d.depth * nodeSize + 8;
	markNodeObject2d.text.y = startY + markNodeObject2d.index * nodeSize + 2;

	markNodeObject2d.circle.x = startX + markNodeObject2d.depth * nodeSize + 2;
	markNodeObject2d.circle.y = startY + markNodeObject2d.index * nodeSize + 8;

	if (markNodeObject2d.polyline) {
		let parentMarkNodeObject2d = AllMarkNodeObject2d.get(markNode.parent);

		markNodeObject2d.polyline.points[0].x = startX + parentMarkNodeObject2d.depth * nodeSize + 2
		markNodeObject2d.polyline.points[0].y = startY + parentMarkNodeObject2d.index * nodeSize + 8

		markNodeObject2d.polyline.points[1].x = startX + parentMarkNodeObject2d.depth * nodeSize + 2;
		markNodeObject2d.polyline.points[1].y = startY + markNodeObject2d.index * nodeSize + 8;

		markNodeObject2d.polyline.points[2].x = startX + markNodeObject2d.depth * nodeSize + 2;
		markNodeObject2d.polyline.points[2].y = startY + markNodeObject2d.index * nodeSize + 8;

		markNodeObject2d.polyline.updateRange();
	}
}


export function drawMarkNode() {
	eachBefore(MarkLogs.rootMarkNode, initMarkNodeObject2d);
	scene.sortObjectsByOrder();
	eachBefore(MarkLogs.rootMarkNode, dealMarkNodeObject2d);
}