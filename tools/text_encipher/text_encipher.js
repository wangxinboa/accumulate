import { copyText } from "../../javascript_utils/textarea.js";


const textEncipher = document.getElementById('textEncipher');
const textDecrypt = document.getElementById('textDecrypt');
const originalText = document.getElementById('originalText');

textEncipher.onchange = (e) => {
	const file = e.target.files[0];

	var reader = new FileReader();
	reader.readAsText(file, 'utf-8');
	reader.onload = function () {
		const ciphertext = window.btoa(window.btoa(encodeURIComponent(reader.result)));
		copyText(ciphertext);
	};
	reader.onerror = function () {
		console.log('读取失败');
	};

	textEncipher.value = '';
}

textDecrypt.onchange = (e) => {
	originalText.value = decodeURIComponent(window.atob(window.atob(e.target.value)));
}

originalText.onchange = (e) => {
	textDecrypt.value = window.btoa(window.btoa(encodeURIComponent(e.target.value)));
}