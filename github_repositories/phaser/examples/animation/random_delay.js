let frameIndex = 0;

const Example = phaserClassMark(class Example extends Phaser.Scene {
	constructor() {
		super();
	}

	preload() {
		this.load.setBaseURL('./');
		this.load.spritesheet('boom', 'assets/explosion.png', { frameWidth: 64, frameHeight: 64, endFrame: 23 });
	}

	create() {
		const config = {
			key: 'explode',
			frames: 'boom',
			frameRate: 30,
			repeat: -1,
			repeatDelay: 2000
		};

		this.anims.create(config);

		// for (let i = 0; i < 256; i++) {
			let x = Phaser.Math.Between(0, 800);
			let y = Phaser.Math.Between(0, 600);

			let boom = this.add.sprite(x, y, 'boom', 23);

			//  Each one can have a random start delay
			boom.play({
				key: 'explode',
				delay: Math.random() * 0
			});
		// }
	}

	update() {
		frameIndex++;
		if (frameIndex > 10) {
			// this.game.pause();
			this.game.loop.stop();
		}
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