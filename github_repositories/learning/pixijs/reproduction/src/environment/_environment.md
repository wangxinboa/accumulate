# \_environment

## autoDetectEnvironment

1. [autoDetectEnvironment.mjs](/github_repositories/learning/pixijs/reproduction/src/environment/autoDetectEnvironment.mjs)

### used

1. AbstractRenderer: loadEnvironmentExtensions 被调用, 将各个 class 根据其 extension 信息, 存放到对应的数组或者对象中
   > - [AbstractRenderer.mjs](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/shared/system/AbstractRenderer.mjs)
   > - [AbstractRenderer.md](/github_repositories/learning/pixijs/reproduction/src/rendering/renderers/shared/system/AbstractRenderer.md)

## adapter

1. [adapter](/github_repositories/learning/pixijs/reproduction/src/environment/adapter.mjs)

### use

1. [BrowserAdapter.mjs](/github_repositories/learning/pixijs/reproduction/src/environment-browser/BrowserAdapter.mjs): 唯一调用 BrowserAdapter 的地方
