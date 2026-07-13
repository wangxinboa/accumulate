import { BaseTask as BaseTaskClass } from "./network/loader/tasks/base_task.js";
import { ImageTask as ImageTaskClass } from "./network/loader/tasks/image_task.js";
import { JsonTask as JsonTaskClass } from "./network/loader/tasks/json_task.js";

declare global {
	namespace JavaScriptUtilsType {
		type BaseTask = BaseTaskClass;
		type ImageTask = ImageTaskClass;
		type JsonTask<Object> = JsonTaskClass<Object>;
		type AllTaskType<T = never> = BaseTask | ImageTask | JsonTask<T>;
		type TaskCallback<T = never> = (task: AllTaskType<T>) => void;

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
