const parser = require('../../../../javascript_libs_npm/node_modules/@babel/parser');
const fs = require('fs');
const path = require('path');

// 路径配置
const TARGET_FILE = path.resolve(__dirname, './generate-ast.js'); // 目标文件路径
const OUTPUT_DIR = path.resolve(__dirname, './'); // 输出目录路径
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'ast.json'); // 输出文件路径

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
	fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

try {
	// 读取目标文件
	const code = fs.readFileSync(TARGET_FILE, 'utf-8');

	// 解析为 AST
	const ast = parser.parse(code, {
		sourceType: 'unambiguous',
		plugins: ['jsx', 'typescript'],      // 按需启用插件
		tokens: true,          // 保留所有词法标记（包括空格、Tab、注释位置）
		ranges: true,          // 记录节点在源码中的起止位置
		attachComment: true    // 精确绑定注释到对应节点
	});

	// 写入 JSON
	fs.writeFileSync(OUTPUT_FILE, JSON.stringify(ast, null, 2));
	console.log(`✅ AST 已生成至: ${OUTPUT_FILE}`);
} catch (error) {
	console.error('❌ 解析失败:', error.message);
}