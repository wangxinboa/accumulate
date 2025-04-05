let frameIndex = 0;

const Example = phaserClassMark(class Example extends Phaser.Scene {
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
			console.error('Example create pointerover');
			button.setBackgroundColor('#8d8d8d');
		}, 'Example create pointerover'));

		button.on('pointerout', phaserFunctionMark(() => {
			console.error('Example create pointerout');
			button.setBackgroundColor('#2d2d2d');
		}, 'Example create pointerout'));
	}

	update() {
		frameIndex++;
		if (frameIndex > 0) {
			// this.game.pause();
			this.game.loop.stop();
		}
	}
})

const config = {
	// type: Phaser.AUTO,
	type: Phaser.CANVAS,
	parent: 'phaser-example',
	input: {
		windowEvents: false,
	},
	width: 800,
	height: 600,
	scene: Example
};

// const game = new Phaser.Game(config);

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

function startGame() {
	// console.clear();
	new Phaser.Game(config);

	setTimeout(() => {
		pointerover();
		pointerout();
	}, 100)
}

setTimeout(startGame, 2000);