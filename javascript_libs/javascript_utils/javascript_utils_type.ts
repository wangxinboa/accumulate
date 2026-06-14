import { BaseTask as BaseTaskClass } from "./loader/task/base_task.js";
import { ImageTask as ImageTaskClass } from "./loader/task/image_task.js";

declare global {
	namespace JavaScriptUtilsType {
		type BaseTask = BaseTaskClass;
		type ImageTask = ImageTaskClass;
		type AllTaskType = BaseTask | ImageTask;
		type TaskCallback = (task: AllTaskType) => void;

		type TweenConfig = {
			duration: number;
			delayTime?: number;
			yoyo?: boolean;
			loopCount?: number;
			targets: Array<TweenConfigTarget>;
		};
		type TweenConfigTarget = {
			target: number;
			path: Array<string>;
			start?: number;
		};
		type TweenCallback = () => {};
		type TweenCallbacks = Array<TweenCallback>;
	}
}

export { JavaScriptUtilsType };
