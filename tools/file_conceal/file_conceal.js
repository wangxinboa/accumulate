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
	let transportFile, zipFile;
	const mineType = 'application/zip';

	if (e.target.files[0].type === mineType) {
		transportFile = e.target.files[1];
		zipFile = e.target.files[0];
	} else if (e.target.files[1] === mineType) {
		transportFile = e.target.files[0];
		zipFile = e.target.files[1];
	} else {
		throw new Error('没有 zip 文件');
	}

	Promise.all([
		readFile(transportFile),
		readFile(zipFile)
	]).then((res) => {
		convertFile(res[0], res[1], transportFile.name.split('.').pop());
	});
	convertFileDom.value = '';
}

recoverFileDom.onchange = (e) => {
	readFile(e.target.files[0]).then((res) => {
		recoverFile(res, 'accumulate.zip');
	});
}