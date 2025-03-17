const Example = phaserClassMark(class Example extends Phaser.Scene {
	constructor() {
		super();
	}

	preload() {
		this.load.setBaseURL('./');
		this.load.atlas('gems', 'assets/gems.png', 'assets/gems.json');
		// Local variable
		this.y = 160;
	}

	create() {
		this.add.text(400, 32, 'Click to create animations', { color: '#00ff00' })
			.setOrigin(0.5, 0);

		//  Each time a new animation is added to the Animation Manager we'll call this function
		this.anims.on(Phaser.Animations.Events.ADD_ANIMATION, this.addAnimation, this);

		this.i = 0;

		//  Click to add an animation
		this.input.on('pointerup', function () {
			console.info('this.input.on pointerup');
			switch (this.i) {
				case 0:
					this.anims.create({ key: 'diamond', frames: this.anims.generateFrameNames('gems', { prefix: 'diamond_', end: 15, zeroPad: 4 }), repeat: -1 });
					break;

				case 1:
					this.anims.create({ key: 'prism', frames: this.anims.generateFrameNames('gems', { prefix: 'prism_', end: 6, zeroPad: 4 }), repeat: -1 });
					break;

				case 2:
					this.anims.create({ key: 'ruby', frames: this.anims.generateFrameNames('gems', { prefix: 'ruby_', end: 6, zeroPad: 4 }), repeat: -1 });
					break;

				case 3:
					this.anims.create({ key: 'square', frames: this.anims.generateFrameNames('gems', { prefix: 'square_', end: 14, zeroPad: 4 }), repeat: -1 });
					break;
			}
			this.i++;

			this.game.step();
		}, this);
	}

	addAnimation(key) {
		this.add.sprite(400, this.y, 'gems')
			.play(key);
		this.y += 100;
	}
});

const config = {
	// type: Phaser.AUTO,
	type: Phaser.CANVAS,
	input: {
		windowEvents: false,
	},
	parent: 'phaser-example',
	width: 800,
	height: 600,
	scene: Example
};

const game = new Phaser.Game(config);


function mouseup() {
	// 模拟事件
	// 获取 dom
	const canvasEventDom = document.querySelectorAll("canvas")[0];
	// 创建event
	const event = document.createEvent("MouseEvents");
	// 初始化event
	event.initMouseEvent("mouseup",
		true, true, document.defaultView, 0,
		10, 10,// screen
		10, 10,// client
		false, false, false, false, 0, null);
	// 触发事件
	canvasEventDom.dispatchEvent(event);
}

setTimeout(() => {
	mouseup();
}, 1000)