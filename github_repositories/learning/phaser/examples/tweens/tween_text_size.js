let frameIndex = 0;

const Example = (class Example extends Phaser.Scene {
	constructor() {
		super();
	}

	create() {
		const text = this.add.text(400, 300, 'GAME OVER!', { fontFamily: 'Arial', size: 20, color: '#000' }).setOrigin(0.5, 0.5);

		this.tweens.addCounter({
			from: 0,
			to: 1,
			duration: 3000,
			yoyo: true,
			onUpdate: (tween) => {

				const v = tween.getValue();
				const c = 255 * v;

				text.setFontSize(20 + v * 64);
				text.setColor(`rgb(${c}, ${c}, ${c})`);
			}
		});
	}

	update() {
		frameIndex++;
		if (frameIndex > 5) {
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
	width: 800,
	height: 600,
	backgroundColor: '#2d2d2d',
	parent: 'phaser-example',
	scene: Example
};

const game = new Phaser.Game(config);
