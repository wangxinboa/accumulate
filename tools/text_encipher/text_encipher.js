import { copyText } from "../../javascript_utils/textarea.js";


const textEncipher = document.getElementById('textEncipher');
const textDecrypt = document.getElementById('textDecrypt');
const prefix = 'data:application/zip;base64,';

textEncipher.onchange = (e) => {
	const file = e.target.files[0];

	var reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = function () {
		const ciphertext = reader.result.split(prefix)[1];
		copyText(ciphertext);
		console.info('文件长度:', ciphertext.length);
	};
	reader.onerror = function () {
		console.log('读取失败');
	};

	textEncipher.value = '';
}

function dataURLToBlob(fileDataURL, filename) {
	let arr = fileDataURL.split(","),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], filename, { type: mime });
}

function download(downfile) {
	const tmpLink = document.createElement("a");
	const objectUrl = URL.createObjectURL(downfile);

	tmpLink.href = objectUrl;
	tmpLink.download = downfile.name;
	document.body.appendChild(tmpLink);
	tmpLink.click();

	document.body.removeChild(tmpLink);
	URL.revokeObjectURL(objectUrl);
}

textDecrypt.onchange = (e) => {
	const originalText = prefix + e.target.value;
	const file = dataURLToBlob(originalText, 'modified-files.zip');
	download(file);
}