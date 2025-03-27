import { isFunction } from '../../../../../javascript_libs/javascript_utils/data_type/is_type.js';
import proxyFunction from './proxy_function.js';

const excludePrototypeKey = ['constructor', '__proto__'];

export default function proxytClass(originalClass, className) {

	const proxy = proxyFunction(originalClass, `${className}`);

	for (let key in originalClass) {
		const value = originalClass[key];
		if (isFunction(value)) {
			originalClass[key] = proxyFunction(originalClass[key], `${className}.${key}`);
		}
	}

	if (originalClass.prototype) {
		const descriptors = Object.getOwnPropertyDescriptors(originalClass.prototype);
		for (let key in descriptors) {
			if (excludePrototypeKey.indexOf(key) === -1) {
				const descriptor = descriptors[key];

				if (isFunction(descriptor.value)) {
					descriptor.value = proxyFunction(descriptor.value, `${className} ${key}`);
				}
				if (isFunction(descriptor.set || descriptor.get)) {
					if (isFunction(descriptor.set)) {
						descriptor.set = proxyFunction(descriptor.set, `${className} set-${key}`);
					}
				}
				Object.defineProperty(originalClass.prototype, key, descriptor);
			}
		}
	}

	return proxy;
}