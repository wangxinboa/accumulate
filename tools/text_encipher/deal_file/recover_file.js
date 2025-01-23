const prefix = 'data:application/zip;base64,';

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

export default function recoverFile(message) {

	const originalText = prefix + message;
	const file = dataURLToBlob(originalText, 'modified-files.zip');
	download(file);
}