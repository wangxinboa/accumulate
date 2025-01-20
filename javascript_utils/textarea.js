const textarea = document.createElement('textarea');

export function copyText(text) {
	textarea.value = text
	document.body.appendChild(textarea);
	textarea.select();

	document.execCommand("copy");
	try {
		var successful = document.execCommand('copy');
		console.info('successful:', successful);
		if (successful) {
			console.log('copyText 复制成功')
		} else {
			console.log('copyText 复制失败')
		}
	} catch (err) {
		console.log('copyText 复制失败')
	} finally {
		document.body.removeChild(textarea)
	}
}

export function readTextFromClipboard() {
	document.body.appendChild(textarea);
	textarea.focus();
	document.execCommand('paste');
	const text = textarea.value;
	document.body.removeChild(textarea);
	return text;
}