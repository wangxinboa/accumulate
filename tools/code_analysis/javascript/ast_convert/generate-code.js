// const generator = require('../../javascript_libs/@babel/generator/babel-generator');
const generator = require('../../../../javascript_libs_npm/node_modules/@babel/generator');
const fs = require('fs');
const path = require('path');

// 定义路径
const AST_FILE = path.resolve(__dirname, './ast.json'); // 输入的AST文件
const OUTPUT_DIR = path.resolve(__dirname, './');       // 输出目录
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'regenerated-code.js');      // 输出的代码文件

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
	fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

try {
	// 读取AST文件
	const astJson = fs.readFileSync(AST_FILE, 'utf-8');
	const ast = JSON.parse(astJson); // 反序列化为AST对象

	// 生成代码（核心操作）
	const { code } = generator.default(ast, {
		retainLines: true,       // 保留原始行号
		comments: true,         // 保留所有注释
		compact: false,         // 禁用压缩模式
		concise: false,         // 禁用简洁模式
		jsescOption: {
			minimal: true,        // 减少不必要的转义
		},
		// 强制保留原始缩进（实验性配置）
		retainFunctionParens: true,
		retainParentheses: true
	}); // 注意：可能需要 .default

	// 写入文件
	fs.writeFileSync(OUTPUT_FILE, code);
	console.log(`✅ 代码已生成至: ${OUTPUT_FILE}`);
} catch (error) {
	console.error('❌ 生成失败:', error.message);
}