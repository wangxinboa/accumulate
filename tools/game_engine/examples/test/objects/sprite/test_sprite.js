
import { Sprite, Scene, Camera2D } from '../../../../src/index.js';

const camera = new Camera2D();
const scene = new Scene({
	wheelMoveCamera: true,
});
scene.bindCamera(camera);

const sprite = new Sprite({
	url: '../../../github_repositories/learning/phaser/examples/assets/gems.png',
	imageBlocks: [
		{
			x: 2,
			y: 2,
			width: 64,
			height: 64
		},
		{
			x: 2,
			y: 68,
			width: 64,
			height: 64
		},
		{
			x: 2,
			y: 134,
			width: 64,
			height: 64
		},
		{
			x: 68,
			y: 2,
			width: 64,
			height: 64
		},
		{
			x: 68,
			y: 68,
			width: 64,
			height: 64
		},
		{
			x: 68,
			y: 134,
			width: 64,
			height: 64
		},
		{
			x: 134,
			y: 2,
			width: 64,
			height: 64
		},
		{
			x: 134,
			y: 68,
			width: 64,
			height: 64
		},
		{
			x: 134,
			y: 134,
			width: 64,
			height: 64
		},
		{
			x: 200,
			y: 2,
			width: 64,
			height: 64
		},
		{
			x: 200,
			y: 68,
			width: 64,
			height: 64
		},
		{
			x: 200,
			y: 134,
			width: 64,
			height: 64
		},
		{
			x: 266,
			y: 2,
			width: 64,
			height: 64
		},
		{
			x: 266,
			y: 68,
			width: 64,
			height: 64
		},
		{
			x: 266,
			y: 134,
			width: 64,
			height: 64
		},
		{
			x: 332,
			y: 2,
			width: 64,
			height: 64
		},
		{
			x: 332,
			y: 68,
			width: 64,
			height: 64
		},
		{
			x: 332,
			y: 134,
			width: 64,
			height: 64
		},
		{
			x: 398,
			y: 2,
			width: 64,
			height: 64
		},
		{
			x: 398,
			y: 68,
			width: 64,
			height: 64
		},
		{
			x: 398,
			y: 134,
			width: 64,
			height: 64
		},
		{
			x: 464,
			y: 2,
			width: 64,
			height: 64
		},
		{
			x: 464,
			y: 68,
			width: 64,
			height: 64
		},
		{
			x: 464,
			y: 134,
			width: 64,
			height: 64
		},
		{
			x: 530,
			y: 2,
			width: 64,
			height: 64
		},
		{
			x: 530,
			y: 68,
			width: 64,
			height: 64
		},
		{
			x: 530,
			y: 134,
			width: 64,
			height: 64
		},
		{
			x: 596,
			y: 2,
			width: 64,
			height: 64
		},
		{
			x: 596,
			y: 68,
			width: 64,
			height: 64
		},
		{
			x: 596,
			y: 134,
			width: 64,
			height: 64
		},
		{
			x: 662,
			y: 2,
			width: 64,
			height: 64
		},
		{
			x: 662,
			y: 68,
			width: 64,
			height: 64
		},
		{
			x: 662,
			y: 134,
			width: 64,
			height: 64
		},
		{
			x: 728,
			y: 2,
			width: 64,
			height: 64
		},
		{
			x: 728,
			y: 68,
			width: 64,
			height: 64
		},
		{
			x: 728,
			y: 134,
			width: 64,
			height: 64
		},
		{
			x: 794,
			y: 2,
			width: 64,
			height: 64
		},
		{
			x: 860,
			y: 2,
			width: 64,
			height: 64
		},
		{
			x: 926,
			y: 2,
			width: 64,
			height: 64
		},
		{
			x: 794,
			y: 68,
			width: 64,
			height: 64
		},
		{
			x: 794,
			y: 134,
			width: 64,
			height: 64
		},
		{
			x: 860,
			y: 68,
			width: 64,
			height: 64
		},
		{
			x: 926,
			y: 68,
			width: 64,
			height: 64
		},
		{
			x: 860,
			y: 134,
			width: 64,
			height: 64
		},
		{
			x: 926,
			y: 134,
			width: 64,
			height: 64
		}
	],
});
sprite.addAnimationIndex('sprite', [
	{
		target: {
			imageBlockIndex: 1,
		},
		duration: 50,
	},
	{
		target: {
			imageBlockIndex: 2,
		},
		duration: 50,
	},
	{
		target: {
			imageBlockIndex: 3,
		},
		duration: 50,
	},
	{
		target: {
			imageBlockIndex: 4,
		},
		duration: 50,
	},
	{
		target: {
			imageBlockIndex: 5,
		},
		duration: 50,
	},
	{
		target: {
			imageBlockIndex: 6,
		},
		duration: 50,
	},
	{
		target: {
			imageBlockIndex: 7,
		},
		duration: 50,
	},
	{
		target: {
			imageBlockIndex: 8,
		},
		duration: 50,
	},
	{
		target: {
			imageBlockIndex: 9,
		},
		duration: 50,
	},
	{
		target: {
			imageBlockIndex: 10,
		},
		duration: 50,
	},
	{
		target: {
			imageBlockIndex: 11,
		},
		duration: 50,
	},
	{
		target: {
			imageBlockIndex: 12,
		},
		duration: 50,
	},
	{
		target: {
			imageBlockIndex: 13,
		},
		duration: 50,
	},
	{
		target: {
			imageBlockIndex: 14,
		},
		duration: 50,
	},
	{
		target: {
			imageBlockIndex: 15,
		},
		duration: 50,
	},
	{
		target: {
			imageBlockIndex: 0,
		},
		duration: 50,
	},
]).loop(Infinity);

scene.add(sprite);

scene.on('toExampleScene', () => {
	sprite.startAnimation('sprite');
});

export default scene;