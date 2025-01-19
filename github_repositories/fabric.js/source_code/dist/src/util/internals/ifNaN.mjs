/**
 *
 * @param value value to check if NaN
 * @param [valueIfNaN]
 * @returns `fallback` is `value is NaN
 */
const ifNaN = codeMarkFunction((value, valueIfNaN) => {
	return isNaN(value) && typeof valueIfNaN === 'number' ? valueIfNaN : value;
}, 'ifNaN');

export { ifNaN };
//# sourceMappingURL=ifNaN.mjs.map
