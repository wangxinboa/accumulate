
export const phaserClassCache = {};

export function addClassCache(phaserClass) {
	const className = phaserClass.name;
	if (phaserClassCache[className]) {
		phaserClassCache[className].phaserClass.push({
			phaserClass,
		});
	} else {
		phaserClassCache[className] = {
			className,
			phaserClass: [{
				phaserClass,
			}],
		};
	}
}

for (let key in phaserClassCache) {
	const phaserClassCacheVal = phaserClassCache[key];
	if (phaserClassCacheVal.phaserClass.length <= 1) {
		//delete phaserClassCache[key];
		//console.info('phaserClassCacheVal:', phaserClassCacheVal);
	}
}

export const phaserClassAlias = {
	Circle: {
		alias: [
			'src/geom/circle/Circle.js',
			'src/fx/Circle.js',
		],
		nowIndex: 0,
	},
	ColorMatrix: {
		alias: [
			'src/display/ColorMatrix.js',
			'src/fx/ColorMatrix.js',
		],
		nowIndex: 0,
	},
	Line: {
		alias: [
			'src/geom/line/Line.js',
			'src/gameobjects/shape/line/Line.js',
		],
		nowIndex: 0,
	},
	Rectangle: {
		alias: [
			'src/geom/rectangle/Rectangle.js',
			'src/gameobjects/shape/rectangle/Rectangle.js',
		],
		nowIndex: 0,
	},
	Curve: {
		alias: [
			'src/curves/Curve.js',
			'src/gameobjects/shape/curve/Curve.js',
		],
		nowIndex: 0,
	},
	Ellipse: {
		alias: [
			'src/geom/ellipse/Ellipse.js',
			'src/gameobjects/shape/ellipse/Ellipse.js',
		],
		nowIndex: 0,
	},
	Factory: {
		alias: [
			'src/physics/arcade/Factory.js',
			'src/physics/matter-js/Factory.js',
		],
		nowIndex: 0,
	},
	Polygon: {
		alias: [
			'src/geom/polygon/Polygon.js',
			'src/gameobjects/shape/polygon/Polygon.js',
		],
		nowIndex: 0,
	},
	Triangle: {
		alias: [
			'src/geom/triangle/Triangle.js',
			'src/gameobjects/shape/triangle/Triangle.js',
		],
		nowIndex: 0,
	},
	World: {
		alias: [
			'src/physics/arcade/World.js',
			'src/physics/matter-js/World.js',
		],
		nowIndex: 0,
	},
	ScenePlugin: {
		alias: [
			'src/plugins/ScenePlugin.js',
			'src/scene/ScenePlugin.js',
		],
		nowIndex: 0,
	}
}
