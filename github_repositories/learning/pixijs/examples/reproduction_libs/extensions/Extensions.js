const extensions = {
	mixin(Target, ...sources) {
		for (const source of sources) {
			Object.defineProperties(Target.prototype, Object.getOwnPropertyDescriptors(source));
		}
	},
};

export { extensions };
