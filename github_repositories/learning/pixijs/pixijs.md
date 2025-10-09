# pixijs

## git 链接

[https://github.com/pixijs/pixijs](https://github.com/pixijs/pixijs)

## 简介

HTML5 创作引擎: 使用最快、最灵活的 2D WebGL 渲染器，创作出精美的数字内容。

## 引用仓库源码

1. 使用 npm install pixi.js@8.9.2, 获取相关代码
2. 进入 lib 文件夹, 打开终端, 调用以下命令行删除不需要的文件(mac)

```
	find . -name "*.d.ts" | xargs rm -rf
	find . -name "*.map" | xargs rm -rf
	find . -name "*.js" | xargs rm -rf
```

3. 在案例源码中添加以下引用需要 js 代码引用, 并从 npm install 下的包中拿到对应的源码放到需要的位置

```
	<script type="importmap">
		{
			"imports": {
				"eventemitter3": "../reproduction/libs/eventemitter3/dist/eventemitter3.esm.js",
				"earcut": "../reproduction/libs/earcut/src/earcut.js",
				"@pixi/colord": "../reproduction/libs/@pixi/colord/index.mjs",
				"@pixi/colord/plugins/names": "../reproduction/libs/@pixi/colord/plugins/names.mjs",
				"ismobilejs": "../reproduction/libs/ismobilejs/esm/isMobile.js",
				"parse-svg-path": "../reproduction/libs/parse-svg-path/index.js",
				"@xmldom/xmldom": "../reproduction/libs/@xmldom/xmldom/lib/index.js"
			}
		}
	</script>
```

3. 直接在服务器访问相关案例，或者调用 PIXI 实现案例效果

## 代码阅读辅助工具函数

1. 方便查看 AbstractRenderer 中 runners 属性的各个函数信息

```
// 先在 AbstractRenderer 中添加 globalThis.renderer = this;
const runnersMessage = {};
const runners = globalThis.renderer.runners;
for (let key in runners) {
	const runner = runners[key];
	const runnerMessage = {};
	runner.items.forEach((runnerItem) => {
		runnerMessage[runnerItem.constructor.name] = {
			isExtends: !runnerItem.constructor.prototype.hasOwnProperty(key),
			fun: runnerItem[key],
			item: runnerItem,
		}
	});
	runnersMessage[key] = runnerMessage;
};
runnersMessage;
```
