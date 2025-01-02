import { isFunction } from "../../../../../javascript_utils/data_type/is_type.js";
import MarkFunction from "../mark_function.js";

const excludePrototypeKey = ['constructor', '__proto__'];

export default function convertClass(originalClass, className) {

	const markedClass = new MarkFunction(originalClass, `${className} constructor`).getMarkedFunction();

	for (let key in originalClass) {
		const value = originalClass[key];
		if (isFunction(value)) {
			markedClass[key] = new MarkFunction(originalClass[key], `${className}.${key}`).getMarkedFunction();
		} else {
			markedClass[key] = value;
		}
	}

	// 获取所有的 prototype 上的 descriptor
	const allClassPrototype = {};
	let classPrototype = originalClass.prototype;
	while (classPrototype) {
		const descriptors = Object.getOwnPropertyDescriptors(classPrototype);
		for (let key in descriptors) {
			if (excludePrototypeKey.indexOf(key) === -1) {
				const descriptor = descriptors[key];
				if (allClassPrototype[key] === void 0) {
					allClassPrototype[key] = descriptor;

					if (isFunction(descriptor.value)) {
						markedClass.prototype[key] = new MarkFunction(descriptor.value, `${className} ${key}`).getMarkedFunction();
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