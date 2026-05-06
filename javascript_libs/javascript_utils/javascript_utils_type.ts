import { BaseTask as BaseTaskClass } from "./loader/task/base_task.js";
import { ImageTask as ImageTaskClass } from "./loader/task/image_task.js";

declare global {
	namespace JavaScriptUtilsType {
		type BaseTask = BaseTaskClass;
		type ImageTask = ImageTaskClass;
		type AllTaskType = BaseTask | ImageTask;
		type TaskCallback = (task: AllTaskType) => void;
	}
}

export { JavaScriptUtilsType };
