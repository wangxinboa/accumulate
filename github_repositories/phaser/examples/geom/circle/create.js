let frameIndex = 0;

const Example = phaserClassMark(class Example extends Phaser.Scene {
	create() {
		const circle = new Phaser.Geom.Circle(400, 300, 100);

		const graphics = this.add.graphics({ fillStyle: { color: 0xff0000 } });
		graphics.fillCircleShape(circle);
	}

	update() {
		frameIndex++;
		if (frameIndex > 0) {
			// this.game.pause();
			this.game.loop.stop();
		}
	}
});

const config = {
	width: 800,
	height: 600,
	// type: Phaser.AUTO,
	type: Phaser.CANVAS,
	input: {
		windowEvents: false,
	},
	parent: 'phaser-example',
	scene: Example
};

const game = new Phaser.Game(config);