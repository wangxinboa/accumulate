export default function convertFile(file0, file1) {
	const buffer1 = new Uint8Array(file0);
	const buffer2 = new Uint8Array(file1);

	// 创建一个新的 TypedArray，其长度是两个数组长度之和
	const combinedBuffer = new Uint8Array(buffer1.length + buffer2.length);

	// 将第一个数组的元素复制到新数组
	combinedBuffer.set(buffer1);
	console.info(buffer1.length);

	// 将第二个数组的元素复制到新数组的后面
	combinedBuffer.set(buffer2, buffer1.length);

	// 创建一个 Blob 对象，类型为 image/jpeg
	const blob = new Blob([combinedBuffer]);

	// 创建一个链接元素用于下载
	const link = document.createElement('a');
	link.href = window.URL.createObjectURL(blob);
	link.download = '测试图片.jpg'; // 指定下载的文件名

	// 模拟点击链接以下载图片
	document.body.appendChild(link);
	link.click();

	// 清理：释放创建的 URL 对象
	window.URL.revokeObjectURL(link.href);
	document.body.removeChild(link);
}
