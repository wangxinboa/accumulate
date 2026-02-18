import { Buffer } from "../../buffer/Buffer.js";
import { BufferUsage } from "../../buffer/const.js";

function ensureIsBuffer(buffer, index) {
	if (!(buffer instanceof Buffer)) {
		let usage = index ? BufferUsage.INDEX : BufferUsage.VERTEX;
		if (buffer instanceof Array) {
			if (index) {
				buffer = new Uint32Array(buffer);
				usage = BufferUsage.INDEX | BufferUsage.COPY_DST;
			} else {
				buffer = new Float32Array(buffer);
				usage = BufferUsage.VERTEX | BufferUsage.COPY_DST;
			}
		}
		buffer = new Buffer({
			data: buffer,
			label: index ? "index-mesh-buffer" : "vertex-mesh-buffer",
			usage,
		});
	}
	return buffer;
}

export { ensureIsBuffer };
