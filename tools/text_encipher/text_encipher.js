import convertFile from "./deal_file/convert_file.js";
import recoverFile from "./deal_file/recover_file.js";

const convertFileDom = document.getElementById('convertFile');
const recoverFileDom = document.getElementById('recoverFile');

convertFileDom.onchange = (e) => {
	const file = e.target.files[0];

	var reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = function () {
		convertFile(reader.result);
	};
	reader.onerror = function () {
		console.log('读取失败');
	};

	convertFileDom.value = '';
}

recoverFileDom.onchange = (e) => {
	recoverFile(e.target.value);
}