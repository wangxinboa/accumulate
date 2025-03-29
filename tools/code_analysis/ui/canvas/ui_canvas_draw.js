import {
	Polyline, Text, Circle,
} from '../../../game_engine/src/index.js';
import start2d from '../../../game_engine/examples/common/start2d.js';

let scene = null;

export function startCodeAnalysisUiCanvasDraw(canvasDom) {
	scene = start2d(canvasDom, null, {
		backgroundColor: '#333333',
	}).scene;
}

const AllMarkNodeObject2d = new Map();
const AllTextMarkNode = new Map();
const AllCircleMarkNode = new Map();

function eachBefore(root, callback, ignoreVisible = false) {
	let node = root, nodes = [root], children, i, index = -1;
	while (node = nodes.pop()) {
		if ((ignoreVisible || node.visible)) {
			callback(node, ++index);
			if ((children = node.children)) {
				for (i = children.length - 1; i >= 0; --i) {
					nodes.push(children[i]);
				}
			}
		}
	}
	return this;
}

let selectedText = null;
function handleMousedownText() {
	if (selectedText) {
		selectedText.backgroundColor = null;
	}
	if (selectedText === this) {
		selectedText = null;
	} else {
		selectedText = this;
		selectedText.backgroundColor = '#b0b0b0';

	}

	const markNode = AllTextMarkNode.get(this);
	const data = markNode.data;
	if (data) {
		const markFunctionMessage = data.markFunctionMessage;
		console.info(`%c函数 key: ${markFunctionMessage.key}`, 'font-size: 18px; color: #ffffff; background-color: #000000;');
		console.info('原始函数:', markFunctionMessage.originalFunction);
		console.info('传入参数:', data.args);
		console.info('返回结果:', data.result);
		console.info('执行次数:', markFunctionMessage.used);
		console.info('当前执行次数:', data.used);
		console.info('父级节点调用记录:', markFunctionMessage.parentsLog);
		console.info('父级节点调用次数:', markFunctionMessage.parentsMap);
	} else {
		console.info(markNode.title, '为空函数');
	}
}

function handleMousedownCircle() {
	const markNode = AllCircleMarkNode.get(this);
	if (markNode.children.length > 0) {
		eachBefore(MarkLog.rootMarkNode, initMarkNodeObject2d, true);
		scene.sortObjectsByOrder();

		eachBefore(MarkLog.rootMarkNode, hideObejct2d, true);
		markNode.childrenVisible = !markNode.childrenVisible;

		for (let i = 0, len = markNode.children.length; i < len; i++) {
			markNode.children[i].visible = markNode.childrenVisible;
		}
		eachBefore(MarkLog.rootMarkNode, initMarkNodeObject2d);
		eachBefore(MarkLog.rootMarkNode, showObject2d);

		scene.sortObjectsByOrder();
		eachBefore(MarkLog.rootMarkNode, dealMarkNodeObject2d);
	}
}

function hideObejct2d(markNode) {
	const markNodeObject2d = AllMarkNodeObject2d.get(markNode);

	markNodeObject2d.text.visible =
		markNodeObject2d.circle.visible = false;
	if (markNodeObject2d.polyline) {
		markNodeObject2d.polyline.visible = false;
	}
}

function showObject2d(markNode) {
	const markNodeObject2d = AllMarkNodeObject2d.get(markNode);

	markNodeObject2d.text.visible =
		markNodeObject2d.circle.visible = true;
	if (markNodeObject2d.polyline) {
		markNodeObject2d.polyline.visible = true;
	}
}

function initMarkNodeObject2d(markNode, index) {
	let markNodeObject2d = null, parentMarkNodeObject2d = null;

	if (markNode.parent) {
		parentMarkNodeObject2d = AllMarkNodeObject2d.get(markNode.parent);
	}

	if (AllMarkNodeObject2d.has(markNode)) {
		markNodeObject2d = AllMarkNodeObject2d.get(markNode);
		markNodeObject2d.index = index;
		markNodeObject2d.depth = parentMarkNodeObject2d ? parentMarkNodeObject2d.depth + 1 : markNodeObject2d.depth;
		markNodeObject2d.circle.radius = markNode.childrenVisible ? 8.5 : 5.5;
	} else {
		markNodeObject2d = {
			depth: parentMarkNodeObject2d ? parentMarkNodeObject2d.depth + 1 : 0,
			index,
			text: new Text({
				x: 0,
				y: 0,
				text: `${markNode.title}` + (markNode.data ? ` ${markNode.data.used}/${markNode.data.markFunctionMessage.used}` : ''),
				fontSize: 14,
				fill: '#000000',
				fontFamily: 'system-ui',
			}).on('pointerdown', handleMousedownText),
			circle: new Circle({
				x: 0, y: 0, radius: 8.5,
				fill: Array.isArray(markNode.children) && markNode.children.length > 0 ? '#000000' : '#999999',
				renderOrder: 1,
			}).on('pointerdown', handleMousedownCircle),
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
		AllTextMarkNode.set(markNodeObject2d.text, markNode);
		AllCircleMarkNode.set(markNodeObject2d.circle, markNode);
	}
	markNodeObject2d.index = index++;
}

const nodeSize = 20, startX = 4, startY = 4;

function dealMarkNodeObject2d(markNode) {
	let markNodeObject2d = AllMarkNodeObject2d.get(markNode);

	markNodeObject2d.text.x = startX + markNodeObject2d.depth * nodeSize + 18;
	markNodeObject2d.text.y = startY + markNodeObject2d.index * nodeSize - 2 - 5 + markNodeObject2d.text.height / 2;

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
	eachBefore(MarkLog.rootMarkNode, initMarkNodeObject2d);
	scene.sortObjectsByOrder();
	eachBefore(MarkLog.rootMarkNode, dealMarkNodeObject2d);
}