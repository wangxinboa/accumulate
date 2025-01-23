import convertFile from "./deal_file/convert_file.js";
import recoverFile from "./deal_file/recover_file.js";

const convertFileDom = document.getElementById('convertFile');
const recoverFileDom = document.getElementById('recoverFile');

function readFile(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsArrayBuffer(file);
		reader.onload = function () {
			resolve(reader.result);
		};
		reader.onerror = function (e) {
			reject(e);
		};
	})
}

convertFileDom.onchange = (e) => {
	Promise.all([
		readFile(e.target.files[0]),
		readFile(e.target.files[1])
	]).then((res) => {
		console.info(res);
		convertFile(res[0], res[1]);
	});
	convertFileDom.value = '';
}

recoverFileDom.onchange = (e) => {
	readFile(e.target.files[0]).then((res) => {
		recoverFile(res);
	});
}