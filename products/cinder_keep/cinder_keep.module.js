/**
 * cinder_keep 游戏入口
 * 类似《吸血鬼幸存者》风格，目前实现：
 * - 标题画面（按任意字符键开始），标题始终居中
 * - 人物移动（WASD / 方向键）
 * - 相机跟随，人物始终居中
 * - 敌人从屏幕边缘生成，向玩家移动
 * - 碰撞检测（触碰敌人则游戏结束）
 * - 子弹发射（空格键，向鼠标位置发射）
 * - 子弹与敌人碰撞销毁（现改为对象池复用）
 */

import {
	Canvas2DEngine,
	Sprite2D,
	TextTexture,
	Vector2,
} from "../../javascript_libs/canvas_engine/src/canvas_engine.js";

// ----------------------------------------------------------------------------
// 1. 获取容器并创建引擎
// ----------------------------------------------------------------------------

const engine = new Canvas2DEngine({
	container: document.body,
	rendererType: "webgl",
	backgroundColor: 0x1a1a2e, // 深蓝紫色背景
	autoStart: true,
});

const scene = engine.scene;
const camera = engine.camera;

// 相机 pivot 设为 (-0.5, -0.5) 使得相机位置 (x,y) 对应屏幕中心
camera.pivotX = camera.pivotY = -0.5;

// ----------------------------------------------------------------------------
// 2. 游戏状态
// ----------------------------------------------------------------------------

/** @type {boolean} 游戏是否已经开始 */
let gameStarted = false;
/** @type {boolean} 游戏是否结束 */
let gameOver = false;

/** @type {number} 人物移动速度（像素/秒） */
const playerSpeed = 240;
/** @type {number} 敌人移动速度（像素/秒） */
const enemySpeed = 80;
/** @type {number} 敌人碰撞半径（像素） */
const enemyCollideRadius = 30;
/** @type {number} 初始生成间隔（秒） */
const initialSpawnInterval = 2.0;
/** @type {number} 最小生成间隔（秒） */
const minSpawnInterval = 0.4;
/** @type {number} 生成间隔加速系数（每过10秒减少0.1秒） */
const spawnAcceleration = 0.1;

/** @type {number} 子弹速度（像素/秒） */
const bulletSpeed = 400;
/** @type {number} 子弹碰撞半径（像素） */
const bulletRadius = 15;
/** @type {number} 射击冷却时间（秒） */
const fireRate = 0.15;

/** @type {Array<Sprite2D>} 敌人列表（活动敌人） */
let enemies = [];
/** @type {Array<{sprite: Sprite2D, vx: number, vy: number}>} 子弹列表（活动子弹） */
let bullets = [];
/** @type {Array<Sprite2D>} 敌人池（空闲敌人） */
const enemyPool = [];
/** @type {Array<{sprite: Sprite2D, vx: number, vy: number}>} 子弹池（空闲子弹） */
const bulletPool = [];

/** @type {number} 上次生成敌人的时间 */
let lastSpawnTime = 0;
/** @type {number} 当前生成间隔 */
let currentSpawnInterval = initialSpawnInterval;
/** @type {number} 游戏开始后的累计时间（秒） */
let gameTime = 0;
/** @type {number} 上次发射子弹的时间 */
let lastFireTime = 0;

/** @type {Vector2} 鼠标在当前帧的世界坐标（用于子弹方向） */
const mouseWorldPos = new Vector2(0, 0);

// 获取画布尺寸的函数（逻辑像素）
function getCanvasSize() {
	const canvas = engine.renderer.canvasSystem.canvasDom;
	return { width: canvas.clientWidth, height: canvas.clientHeight };
}

// ----------------------------------------------------------------------------
// 3. 创建标题文本（开始画面）
// ----------------------------------------------------------------------------

const titleTexture = new TextTexture("Cinder Keep", {
	fontSize: 64,
	fontWeight: "bold",
	fontFamily: "Arial, sans-serif",
});
const titleSprite = new Sprite2D(titleTexture);
titleSprite.centerSelf();

const hintTexture = new TextTexture("Press any key to start", {
	fontSize: 24,
	fontFamily: "Arial, sans-serif",
});
const hintSprite = new Sprite2D(hintTexture);
hintSprite.centerSelf();
hintSprite.y = -80; // 位于标题下方

scene.add(titleSprite);
scene.add(hintSprite);

// ----------------------------------------------------------------------------
// 4. 创建人物
// ----------------------------------------------------------------------------

const playerTexture = new TextTexture("🧙", { fontSize: 16 });
const playerSprite = new Sprite2D(playerTexture);
playerSprite.centerSelf();
playerSprite.x = 0;
playerSprite.y = 0;
playerSprite.visible = false;
scene.add(playerSprite);

// ----------------------------------------------------------------------------
// 5. 创建游戏结束文本（初始隐藏）
// ----------------------------------------------------------------------------

const gameOverTexture = new TextTexture("💀 Game Over", {
	fontSize: 64,
	fontWeight: "bold",
	fontFamily: "Arial, sans-serif",
});
const gameOverSprite = new Sprite2D(gameOverTexture);
gameOverSprite.centerSelf();
gameOverSprite.visible = false;
scene.add(gameOverSprite);

// ----------------------------------------------------------------------------
// 6. 键盘输入状态
// ----------------------------------------------------------------------------

/** @type {Record<string, boolean>} */
const keys = {
	ArrowUp: false,
	ArrowDown: false,
	ArrowLeft: false,
	ArrowRight: false,
	w: false,
	a: false,
	s: false,
	d: false,
	// 空格不用于按住，只在keydown触发
};

// ----------------------------------------------------------------------------
// 7. 键盘与鼠标事件绑定（鼠标事件绑定到 scene）
// ----------------------------------------------------------------------------

engine.keyboard.onKeyDown((event) => {
	const key = event.key;

	// 记录方向键状态
	if (key in keys) {
		keys[key] = true;
		event.preventDefault();
	}

	// 按任意字符键开始游戏（忽略功能键）
	if (!gameStarted && key.length === 1) {
		gameStarted = true;
		titleSprite.visible = false;
		hintSprite.visible = false;
		playerSprite.visible = true;
		playerSprite.x = 0;
		playerSprite.y = 0;
		// 重置游戏状态
		resetGame();
	}

	// 游戏结束后按任意键重新开始（简单重置）
	if (gameOver && key.length === 1) {
		gameStarted = true;
		gameOver = false;
		gameOverSprite.visible = false;
		playerSprite.visible = true;
		playerSprite.x = 0;
		playerSprite.y = 0;
		resetGame();
	}

	// 发射子弹（空格键）
	if (gameStarted && !gameOver && key === " ") {
		event.preventDefault();
		fireBullet();
	}
});

engine.keyboard.onKeyUp((event) => {
	const key = event.key;
	if (key in keys) {
		keys[key] = false;
		event.preventDefault();
	}
});

// 监听鼠标移动：自动更新鼠标世界坐标
scene.onMouseMove((_node, x, y) => {
	mouseWorldPos.set(x, y);
});

// 监听鼠标按下：发射子弹
scene.onMouseDown((_node, x, y) => {
	if (gameStarted && !gameOver) {
		fireBullet(x, y);
	}
});

// ----------------------------------------------------------------------------
// 8. 游戏重置函数（复用池中对象，清空活动列表）
// ----------------------------------------------------------------------------

/**
 * 重置游戏状态：将所有活动敌人和子弹放回池中，清空活动列表
 */
function resetGame() {
	// 将敌人放回池中
	for (const enemy of enemies) {
		scene.remove(enemy);
		enemyPool.push(enemy);
	}
	enemies = [];

	// 将子弹放回池中
	for (const bullet of bullets) {
		scene.remove(bullet.sprite);
		bulletPool.push(bullet);
	}
	bullets = [];

	gameTime = 0;
	currentSpawnInterval = initialSpawnInterval;
	lastSpawnTime = 0;
	lastFireTime = 0;
}

// ----------------------------------------------------------------------------
// 9. 敌人相关函数（使用对象池）
// ----------------------------------------------------------------------------

/**
 * 从池中获取一个敌人精灵，如果没有则新建
 * @returns {Sprite2D}
 */
function getEnemyFromPool() {
	const enemy = enemyPool.pop();
	if (enemy) {
		return enemy;
	}
	// 新建敌人精灵
	const enemyTexture = new TextTexture("👾", { fontSize: 36 });
	const newEnemy = new Sprite2D(enemyTexture);
	newEnemy.centerSelf();
	return newEnemy;
}

/**
 * 生成一个敌人，位于屏幕外边缘，并面向玩家
 */
function spawnEnemy() {
	const { width, height } = getCanvasSize();
	const radius = Math.max(width, height) / 2 + 100;
	const angle = Math.random() * 2 * Math.PI;
	const spawnX = Math.cos(angle) * radius;
	const spawnY = Math.sin(angle) * radius;

	const enemy = getEnemyFromPool();
	enemy.x = spawnX;
	enemy.y = spawnY;
	scene.add(enemy);
	enemies.push(enemy);
}

/**
 * 将敌人放回池中
 * @param {Sprite2D} enemy
 */
function recycleEnemy(enemy) {
	scene.remove(enemy);
	enemyPool.push(enemy);
}

/**
 * 更新所有敌人：向玩家移动，并检测碰撞
 * @param {number} delta 时间差（秒）
 * @returns {boolean} 如果发生碰撞返回 true
 */
function updateEnemies(delta) {
	const playerPos = { x: playerSprite.x, y: playerSprite.y };
	let collided = false;

	for (let i = enemies.length - 1; i >= 0; i--) {
		const enemy = enemies[i];
		const dx = playerPos.x - enemy.x;
		const dy = playerPos.y - enemy.y;
		const dist = Math.sqrt(dx * dx + dy * dy);
		if (dist < 0.001) continue;

		const speed = enemySpeed * delta;
		enemy.x += (dx / dist) * speed;
		enemy.y += (dy / dist) * speed;

		if (dist < enemyCollideRadius) {
			collided = true;
			recycleEnemy(enemy);
			enemies.splice(i, 1);
		}
	}
	return collided;
}

// ----------------------------------------------------------------------------
// 10. 子弹相关函数（使用对象池）
// ----------------------------------------------------------------------------

/**
 * 从池中获取一个子弹对象，如果没有则新建
 * @returns {{sprite: Sprite2D, vx: number, vy: number}}
 */
function getBulletFromPool() {
	const bullet = bulletPool.pop();
	if (bullet) {
		return bullet;
	}
	// 新建子弹精灵
	const bulletTexture = new TextTexture("●", { fontSize: 24, fontWeight: "bold" });
	const bulletSprite = new Sprite2D(bulletTexture);
	bulletSprite.centerSelf();
	return { sprite: bulletSprite, vx: 0, vy: 0 };
}

/**
 * 将子弹放回池中
 * @param {{sprite: Sprite2D, vx: number, vy: number}} bullet
 */
function recycleBullet(bullet) {
	scene.remove(bullet.sprite);
	bulletPool.push(bullet);
}

/**
 * 发射子弹
 * @param {number} [targetX] 目标世界坐标 X（可选，不传则使用鼠标世界坐标）
 * @param {number} [targetY] 目标世界坐标 Y（可选，不传则使用鼠标世界坐标）
 */
function fireBullet(targetX, targetY) {
	const now = performance.now() / 1000; // seconds
	if (now - lastFireTime < fireRate) return;
	lastFireTime = now;

	// 确定瞄准坐标
	const aimX = targetX !== undefined ? targetX : mouseWorldPos.x;
	const aimY = targetY !== undefined ? targetY : mouseWorldPos.y;

	// 计算方向向量
	const dx = aimX - playerSprite.x;
	const dy = aimY - playerSprite.y;
	const len = Math.sqrt(dx * dx + dy * dy);
	if (len < 0.001) return; // 目标太近，不发射

	const normDx = dx / len;
	const normDy = dy / len;

	// 从池中获取子弹
	const bullet = getBulletFromPool();
	bullet.sprite.x = playerSprite.x + normDx * 30;
	bullet.sprite.y = playerSprite.y + normDy * 30;
	bullet.vx = normDx * bulletSpeed;
	bullet.vy = normDy * bulletSpeed;

	scene.add(bullet.sprite);
	bullets.push(bullet);
}

/**
 * 更新所有子弹：移动，碰撞检测，移除越界（放回池中）
 * @param {number} delta 时间差（秒）
 */
function updateBullets(delta) {
	const canvas = engine.renderer.canvasSystem.canvasDom;
	const margin = 100; // 超出屏幕边缘多少像素后移除

	for (let i = bullets.length - 1; i >= 0; i--) {
		const bullet = bullets[i];
		// 移动
		bullet.sprite.x += bullet.vx * delta;
		bullet.sprite.y += bullet.vy * delta;

		// 碰撞检测：子弹 vs 敌人
		let bulletUsed = false;
		for (let j = enemies.length - 1; j >= 0; j--) {
			const enemy = enemies[j];
			const dx = bullet.sprite.x - enemy.x;
			const dy = bullet.sprite.y - enemy.y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist < bulletRadius + enemyCollideRadius) {
				// 碰撞，回收敌人和子弹
				recycleEnemy(enemy);
				enemies.splice(j, 1);
				recycleBullet(bullet);
				bullets.splice(i, 1);
				bulletUsed = true;
				break; // 一颗子弹只消灭一个敌人
			}
		}

		if (bulletUsed) continue;

		// 超出屏幕移除（回收）
		const rect = canvas.getBoundingClientRect();
		if (
			bullet.sprite.x < -margin ||
			bullet.sprite.x > rect.width + margin ||
			bullet.sprite.y < -margin ||
			bullet.sprite.y > rect.height + margin
		) {
			recycleBullet(bullet);
			bullets.splice(i, 1);
		}
	}
}

// ----------------------------------------------------------------------------
// 11. 游戏循环（更新人物位置、相机、敌人、子弹）
// ----------------------------------------------------------------------------

/** @type {number} 上一帧的时间戳 */
let lastTimestamp = 0;

engine.timeTicker.addRunCallback((timestamp) => {
	if (!gameStarted) {
		lastTimestamp = timestamp;
		return;
	}

	if (gameOver) {
		lastTimestamp = timestamp;
		return;
	}

	const delta = lastTimestamp === 0 ? 0 : (timestamp - lastTimestamp) / 1000;
	lastTimestamp = timestamp;

	gameTime += delta;

	// 更新生成间隔
	currentSpawnInterval = Math.max(
		minSpawnInterval,
		initialSpawnInterval - Math.floor(gameTime / 10) * spawnAcceleration,
	);

	// 生成敌人
	if (lastSpawnTime === 0 || gameTime - lastSpawnTime >= currentSpawnInterval) {
		spawnEnemy();
		lastSpawnTime = gameTime;
	}

	// 玩家移动
	let dx = 0;
	let dy = 0;
	if (keys.ArrowUp || keys.w) dy -= 1;
	if (keys.ArrowDown || keys.s) dy += 1;
	if (keys.ArrowLeft || keys.a) dx -= 1;
	if (keys.ArrowRight || keys.d) dx += 1;
	if (dx !== 0 || dy !== 0) {
		const len = Math.sqrt(dx * dx + dy * dy);
		dx /= len;
		dy /= len;
		playerSprite.x += dx * playerSpeed * delta;
		playerSprite.y += dy * playerSpeed * delta;
	}

	// 更新敌人
	const collided = updateEnemies(delta);
	if (collided) {
		gameOver = true;
		gameOverSprite.visible = true;
		playerSprite.visible = false;
		// 将所有活动敌人和子弹放回池中
		resetGame();
	}

	// 更新子弹
	updateBullets(delta);

	// 相机跟随
	camera.x = -playerSprite.x;
	camera.y = -playerSprite.y;
	camera.updateMatrix();
});

// ----------------------------------------------------------------------------
// 12. 启动信息
// ----------------------------------------------------------------------------

console.log("🎮 Cinder Keep 已启动！按任意键开始游戏。");
console.log("🕹️ WASD/方向键移动，空格/鼠标左键射击");
