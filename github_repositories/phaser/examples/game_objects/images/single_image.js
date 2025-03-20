let frameIndex = 0;

const Example = phaserClassMark(class Example extends Phaser.Scene {
	image;

	preload() {
		this.load.setBaseURL('./');
		this.load.image('einstein', 'assets/ra-einstein.png');
	}

	create() {
		this.image = this.add.image(400, 300, 'einstein');
	}

	update() {
		this.image.rotation += 0.01;
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
	input: {
		windowEvents: false,
	},
	width: 800,
	height: 600,
	backgroundColor: '#2d2d2d',
	parent: 'phaser-example',
	scene: Example
};

const game = new Phaser.Game(config);

setTimeout(() => {
	game.step();
}, 1000);