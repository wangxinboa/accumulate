import MarkFunction from '../../../tools/code_analysis/javascript/code_mark/mark_function.js';
import { isFunction } from '../../../javascript_utils/data_type/is_type.js';
import { phaserClassAlias } from './phaser_cache.js';

const excludePrototypeKey = ['constructor', '__proto__'];

export function phaserClassMark(phaserClass, aliasName) {
	let className = aliasName || phaserClass.name;
	const aliasMessaage = phaserClassAlias[className];
	if (aliasMessaage) {
		className = aliasMessaage.alias[aliasMessaage.nowIndex++];
	}

	const markedClass = new MarkFunction(phaserClass, `${className} constructor`).getMarkedFunction();

	for (let key in phaserClass) {
		const value = phaserClass[key];
		if (isFunction(value)) {
			markedClass[key] = new MarkFunction(phaserClass[key], `${className}.${key}`).getMarkedFunction();
		} else {
			markedClass[key] = value;
		}
	}

	// 获取所有的 prototype 上的 descriptor
	const allClassPrototype = {};
	let classPrototype = phaserClass.prototype;
	while (classPrototype) {
		const descriptors = Object.getOwnPropertyDescriptors(classPrototype);
		for (let key in descriptors) {
			if (excludePrototypeKey.indexOf(key) === -1) {
				const descriptor = descriptors[key];
				if (allClassPrototype[key] === void 0) {
					allClassPrototype[key] = descriptor;

					if (isFunction(descriptor.value)) {
						markedClass.prototype[key] = new MarkFunction(descriptor.value, `${className} ${key}`).getMarkedFunction();
						// markClass.addMethod({
						//	methodName: key,
						//	method: descriptor.value,
						//	isStatic: false,
						//}).getMarkedMethod();
					} else {
						markedClass.prototype[key] = descriptor.value;
					}
					if (isFunction(descriptor.set || descriptor.get)) {
						if (isFunction(descriptor.set)) {
							descriptor.set = new MarkFunction(descriptor.set, `${className} set-${key}`).getMarkedFunction();
						}
						Object.defineProperty(markedClass.prototype, key, descriptor);
					}
				}
			}
		}

		if (markedClass.prototype.__proto__ === classPrototype.__proto__) {
			break;
		} else {
			classPrototype = classPrototype.__proto__;
		}
	}

	const proxy = new Proxy(markedClass, {
		set: function (target, prop, value) {
			if (isFunction(value)) {
				target[prop] = new MarkFunction(value, `${className}.${prop}`).getMarkedFunction();
			} else {
				target[prop] = value;
			}
			return true;
		},
	});

	return proxy;
}

export function phaserFunMark(phaserFun, aliasName) {
	const functionName = aliasName || phaserFun.name;
	return new MarkFunction(phaserFun, functionName).getMarkedFunction();
}

export function phaserObjectFunMark(phaserObjectFun, objectName) {
	const markedObjectFun = {};
	for (let key in phaserObjectFun) {
		const fun = phaserObjectFun[key];
		if (isFunction(fun)) {
			markedObjectFun[key] = phaserFunMark(fun, `${objectName}.${key}`);
		} else {
			// throw new Error(`phaserObjectFunMark phaserObjectFun 中的 ${key} 属性值不是 function`);
		}
	}

	return markedObjectFun;
}
