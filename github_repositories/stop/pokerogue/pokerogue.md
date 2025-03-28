# pokerogue

## git 链接
[https://github.com/pagefaultgames/pokerogue](https://github.com/pagefaultgames/pokerogue)

## 简介
pokerogue 是一款基于浏览器的口袋妖怪游戏，深受肉鸽游戏题材的启发。在收集堆叠物品的同时进行无休止的战斗，探索许多不同的生物群落，战斗训练师，boss等等

## 引用仓库源码
1. 在服务器根目录中添加 pokerogue , 并将源码版本调至 46d110e705f8ceb957dd67d3743a53f2e478a579

2. 在终端进入 pokerogue, 并输入命令
```
tsc ./src/main.ts --target ES6 --module ES6
```

3. 再次在终端输入命令
<!-- 来自 AI -->
```
node -e "const fs=require('fs'),path=require('path'); function processDir(dir) { fs.readdirSync(dir,{withFileTypes:true}).forEach(dirent => { const p=path.join(dir, dirent.name); if (dirent.isDirectory()) processDir(p); else if (p.endsWith('.js')) { let code=fs.readFileSync(p,'utf8'); code=code.replace(/(from\s+['\"])(.*?)(['\"])/g, (_,a,b,c)=>b.endsWith('.js')?a+b+c:a+b+'.js'+c); fs.writeFileSync(p,code);}});} processDir('src');"
```

4. 进入 pokerogue 源码，并且注释所有的 `import Phaser from 'phaser.js';` 代码

5. 再次注释 `json-beautify.js` 相关代码

6. 再次注释 `vite-plugin-fs/browser.js` 相关代码