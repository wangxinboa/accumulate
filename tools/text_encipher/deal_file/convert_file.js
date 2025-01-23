import { copyText } from "../../../javascript_utils/textarea.js";

const prefix = 'data:application/zip;base64,';

export default function convertFile(fileMessage) {
	const ciphertext = fileMessage.split(prefix)[1];
	copyText(ciphertext);
	console.info('文件长度:', ciphertext.length);
}
