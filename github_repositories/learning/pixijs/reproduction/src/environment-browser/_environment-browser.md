# \_environment-browser

## browserExt

- [browserExt.mjs](/github_repositories/learning/pixijs/reproduction/src/environment-browser/browserExt.mjs)

### used

1. [src/index.mjs](/github_repositories/learning/pixijs/reproduction/src/index.mjs): browserExt 作为参数被 extensions.add 调用
2. [autoDetectEnvironment.mjs](/github_repositories/learning/pixijs/reproduction/src/environment/autoDetectEnvironment.mjs) 调用 browserExt 执行 test,load 的地方, 以及存放 browserExt 的 environments 数组

### use

1. [browserAll.mjs](/github_repositories/learning/pixijs/reproduction/src/environment-browser/browserAll.mjs): 调用 extensions 对其他 class 对象进行处理
