const fs = require('fs');
const path = require('path');

// 获取当前执行的脚本文件的绝对路径
const currentScript = path.resolve(process.argv[1]);

function findJSFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // 递归处理子目录
      findJSFiles(fullPath, fileList);
    } else if (
      entry.isFile() &&
      path.extname(entry.name).toLowerCase() === '.js' &&
      fullPath !== currentScript
    ) {
      // 转换为相对路径并替换为斜杠
      const relativePath = path.relative(process.cwd(), fullPath).replace(/\\/g, '/');
      fileList.push(relativePath);
    }
  }
  return fileList;
}

// 获取所有符合条件的.js文件路径
const allFiles = findJSFiles(process.cwd());

// 输出import语句
allFiles.forEach(file => {
  console.log(`<script defer type="text/javascript" src="/pixijs/src/pixi/${file}"></script>`);
});