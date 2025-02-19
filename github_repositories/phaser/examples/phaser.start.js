
const Example = phaserClassMark(class Example extends Phaser.Scene {
	// angle = 0;
	// text;
	// point2;
	// point;
	// graphics;

	// create() {
	// 	this.graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x2266aa } });

	// 	this.point = new Phaser.Math.Vector2(250, 0);
	// 	this.point2 = new Phaser.Math.Vector2(250, 0);

	// 	this.text = this.add.text(30, 30, '');

	// 	this.input.on('pointermove', pointer => {
	// 		this.point2.copy(pointer);

	// 		this.point2.x -= 400;
	// 		this.point2.y -= 300;
	// 	});
	// }

	// update() {
	// 	this.graphics.clear();

	// 	this.angle += 0.005;

	// 	// vector starting at 0/0
	// 	this.point.setTo(Math.cos(this.angle) * 250, Math.sin(this.angle) * 250);

	// 	// drawn from the center (as if center was 0/0)
	// 	this.graphics.lineBetween(400, 300, 400 + this.point.x, 300 + this.point.y);

	// 	this.graphics.lineStyle(2, 0x00aa00);
	// 	this.graphics.lineBetween(400, 300, 400 + this.point2.x, 300 + this.point2.y);

	// 	const cross = this.point.cross(this.point2);

	// 	const area = this.point.length() * this.point2.length();

	// 	const angleBetween = Math.asin(cross / area);

	// 	this.text.setText([
	// 		`Cross product: ${cross}`,
	// 		`Normalized cross product: ${cross / area}`,
	// 		`Sinus of the angle between vectors: ${Phaser.Math.RadToDeg(angleBetween)}`,
	// 		`Green vector is on the ${cross > 0 ? 'right' : 'left'}`
	// 	].join('\n'));
	// }

	create() {
		const button = this.add.text(400, 300, 'Play Game', {
			fontFamily: 'Arial',
			fontSize: '32px',
			color: '#ffffff',
			align: 'center',
			fixedWidth: 260,
			backgroundColor: '#2d2d2d'
		}).setPadding(32).setOrigin(0.5);

		button.setInteractive({ useHandCursor: true });

		button.on('pointerover', phaserFunctionMark(() => {
			console.info('pointerover');
			button.setBackgroundColor('#8d8d8d');
		}, 'Example create pointerover'));

		button.on('pointerout', phaserFunctionMark(() => {
			console.info('pointerout');
			button.setBackgroundColor('#2d2d2d');
		}, 'Example create pointerout'));
	}
});

function pointerover() {
	// 模拟事件
	// 获取 dom
	const canvasEventDom = document.querySelectorAll("canvas")[0];
	// 创建event
	const event = document.createEvent("MouseEvents");
	// 初始化event
	event.initMouseEvent("mousemove",
		true, true, document.defaultView, 0,
		400, 300,// screen
		400, 300,// client
		false, false, false, false, 0, null);
	// 触发事件
	canvasEventDom.dispatchEvent(event);
}

function pointerout() {
	// 模拟事件
	// 获取 dom
	const canvasEventDom = document.querySelectorAll("canvas")[0];
	// 创建event
	const event = document.createEvent("MouseEvents");
	// 初始化event
	event.initMouseEvent("mousemove",
		true, true, document.defaultView, 0,
		0, 0,// screen
		0, 0,// client
		false, false, false, false, 0, null);
	// 触发事件
	canvasEventDom.dispatchEvent(event);
}

const config = {
	width: 800,
	height: 600,
	type: Phaser.CANVAS,
	parent: 'phaser-example',
	scene: Example,
	input: {
		windowEvents: false,
	}
};

function startGame() {
	// console.clear();
	new Phaser.Game(config);

	setTimeout(() => {
		pointerover();
		pointerout();
		updateCodeAnalysisUi();
	}, 100)
}

setTimeout(startGame, 2000);