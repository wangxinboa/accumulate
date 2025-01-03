import proxyFunction from "../proxy_function.js";

export default function convertFunction(originalFunction, functionName) {

	return proxyFunction(originalFunction, functionName);
}