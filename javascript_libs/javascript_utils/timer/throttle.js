import { now as getNow } from "./now.js";
/**
 * underscore 节流函数，返回函数连续调用时，func 执行频率限定为 次 / wait
 *
 * @param  {function}   func      回调函数
 * @param  {number}     wait      表示时间窗口的间隔
 *
 * @return {function}             返回客户调用函数
 */
export function throttle(func, wait) {
	/** @type {any} */
	let context = null;
	/** @type {IArguments | null} */
	let args = null;
	/** @type {any} */
	let result = null;
	/**  @type {number | null} */
	let now = null;
	/** @type {number | null} */
	let previous = null;

	function run() {
		result = func.apply(context, args);
		context = args = null;
		previous = now;
	}

	/** @this {any} */
	function throttle() {
		// 获得当前时间戳
		now = getNow();

		context = this;
		args = arguments;
		if (previous) {
			if (now - previous > wait) {
				run();
			}
		} else {
			//previous 还未初始化
			run();
		}
		return result;
	}
	return throttle;
}
