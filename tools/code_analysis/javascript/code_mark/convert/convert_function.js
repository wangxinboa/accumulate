import MarkFunction from "../mark_function.js";

export default function convertFunction(originalFunction, functionName) {
	return new MarkFunction(originalFunction, functionName).getMarkedFunction();
}