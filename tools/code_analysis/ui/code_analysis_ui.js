import * as d3Hierarchy from '../../../libs/d3-hierarchy/src/index.js';
import { GameEngine, Circle, Polyline, Text } from '../../game_engine/src/index.js';

const data = await fetch('./test.json').then((res) => { return res.json() });
const root = d3Hierarchy.hierarchy(data)
	.eachBefore(((i) => {
		return (d) => {
			d.index = i++
		}
	})(0));
const nodes = root.descendants();
const links = root.links();

globalThis.nodes = nodes;
globalThis.links = links;

const canvasDom = document.getElementById('renderCanvas');
const gameEngine = new GameEngine(canvasDom, {
	fitType: 'fill',
	renderType: '2d',
});

const nodeSize = 20, startX = 4, startY = 4;

links.forEach((link) => {
	var polyline = new Polyline(gameEngine.scene, {
		points: [
			{ x: startX + link.source.depth * nodeSize + 2, y: startY + link.source.index * nodeSize + 8 },
			{ x: startX + link.source.depth * nodeSize + 2, y: startY + link.target.index * nodeSize + 8 },
			{ x: startX + link.target.depth * nodeSize + 2, y: startY + link.target.index * nodeSize + 8 },
		],
		strokeWidth: 1,
		stroke: Array.isArray(link.target.children) && link.target.children.length > 0 ? '#000000' : '#999999',
		fill: null,
	});

});

nodes.forEach((node) => {
	const text = new Text(gameEngine.scene, {
		x: startX + node.depth * nodeSize + 8,
		y: startY + node.index * nodeSize,
		text: node.data.key,
		fontSize: 14,
		fill: '#000000',
	});

	const circle = new Circle(gameEngine.scene, {
		x: startX + node.depth * nodeSize + 2,
		y: startY + node.index * nodeSize + 8,
		radius: 2.5,

		originX: 'center',
		originY: 'center',
		fill: Array.isArray(node.children) && node.children.length > 0 ? '#000000' : '#999999',
	});
});

gameEngine.requestRender();