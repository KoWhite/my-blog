
## 构建配置管理
### 构建配置抽离成 npm 包的意义
::: tip 通用性
1. 业务开发者无需关注构建配置
2. 统一团队构建脚本 
:::

::: tip 可维护性
1. 构建配置合理的拆分
2. README 文档、ChangeLog 文档等
:::

::: tip 质量
1. 冒烟测试、单元测试、测试覆盖等
2. 持续集成
:::

### 可选方案
1、通过多个配置文件管理不同环境的构建， webpack --config 参数进行控制；

2、将构建配置设计成一个库，比如：hjs-webpack、Neutrino、webpack-blocks；

3、抽成一个工具进行管理，比如：create-react-app、kyt、nwb；（人数规模较大）

4、将所有的配置放在一个文件，通过--env 参数控制分支选择；

### 构建配置包设计
(1)、通过多个配置文件管理不同环境的 webpack 配置
1. 基础配置：webpack.base.js
2. 开发环境：webpack.dev.js
3. 生产环境：webpack.prod.js
4. SSR环境：webpack.ssr.js

(2)、抽离成一个 npm 包统一管理
规范：Git commit 日志、README、ESLint 规范、Semver 规范
质量：冒烟测试、单元测试、测试覆盖率和CI