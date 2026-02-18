import { DOMAdapter } from "../../../../environment/adapter.js";

async function loadImageBitmap(url, asset) {
	const response = await DOMAdapter.get().fetch(url);
	if (!response.ok) {
		throw new Error(`[loadImageBitmap] Failed to fetch ${url}: ${response.status} ${response.statusText}`);
	}
	const imageBlob = await response.blob();
	return asset?.data?.alphaMode === "premultiplied-alpha"
		? createImageBitmap(imageBlob, { premultiplyAlpha: "none" })
		: createImageBitmap(imageBlob);
}

export { loadImageBitmap };
