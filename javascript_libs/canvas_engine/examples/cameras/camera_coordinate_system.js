import { engine } from "../canvas_engine_examples.module.js";
import { Sprite2D } from "../../src/render_nodes/2d/sprite2d/sprite2d.js";

const pos = Sprite2D.createFromText(`-,-`);

pos.x = 200;
pos.y = 0;

engine.scene.addMouseMoveEvent((_renderNode, x, y, sx, sy) => {
	console.info("x:", x);
	console.info("y:", y);

	console.info("sx:", sx);
	console.info("sy:", sy);
	pos.text = `${Math.round(x)},${Math.round(y)}`;
});

engine.scene.add(pos);

/**
 * @type {Sprite2D[]}
 */
const numberSprite2Ds = [];
for (let i = 0; i < 9; i++) {
	const col = i % 3;
	const row = Math.floor(i / 3);
	const x = (col - 1) * 100;
	const y = (1 - row) * 100;
	const sprite2D = Sprite2D.createFromText(`${x},${y}`);

	sprite2D.centerSelf();
	sprite2D.x = x;
	sprite2D.y = y;

	numberSprite2Ds.push(sprite2D);
	engine.scene.add(sprite2D);
}
