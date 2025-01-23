// 根据实际情况设置长度
const length = 30013;

export default function recoverFile(message) {
	// 切片 ArrayBuffer 以获取从 offset 位置开始的数据
	const slicedArrayBuffer = message.slice(length);

	// 创建一个 Blob 对象，类型为 application/zip
	const blob = new Blob([slicedArrayBuffer], { type: 'application/zip' });

	// 创建一个链接元素用于下载
	const link = document.createElement('a');
	link.href = window.URL.createObjectURL(blob);
	link.download = 'downloaded-file.zip'; // 指定下载的文件名

	// 模拟点击链接以下载文件
	document.body.appendChild(link);
	link.click();

	// 清理：释放创建的 URL 对象
	window.URL.revokeObjectURL(link.href);
	document.body.removeChild(link);
}