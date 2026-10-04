# SpinPlot

浏览器端 CW EPR 数据处理与作图软件。作者：hyphoon；联系：wuhaifeng@ustc.edu.cn。

## 使用

https://plastocyanin.org/spinplot/ 直接打开软件。当前版本 **0.2.2**，初次公开发布为 0.1.0。

目前提供数据读取、多谱绘图、频率设置、基线处理、标注、磁场测距及矢量导出。PDF 基础字体不支持中文，中文标签使用 SVG。完整浏览器数据操作仍需继续核对。

## 开发与发布

使用 Node.js 22 或兼容的较新版本。

```sh
npm ci
npm run dev
npm run build
npm run preview
```

main 提交触发 .github/workflows/pages.yml，发布 dist。Vite base 为 /spinplot/。首页直接承载软件，旧 /spinplot/legacy/ 地址跳转至首页。

当前应用仍使用 index.html 中的既有计算与交互代码，TypeScript/React 依赖保留用于后续模块化迁移；迁移尚未完成。计划见 docs/ARCHITECTURE.md。

## 版本管理

采用 MAJOR.MINOR.PATCH；package.json 的 version 是应用版本唯一来源，构建时写入页面、About 与保存文件的 appVersion。0.1.0 是首次公开发布，历史脚本序号不作为发布版本。

补丁修复使用 0.1.1 等版本；新增兼容功能使用 0.2.0 等版本；0.x 阶段不兼容改动增加次版本并注明迁移要求。接口与项目格式稳定后发布 1.0.0。每次发布更新 CHANGELOG.md，使用对应 vX.Y.Z 标签；标签只能在构建和部署核对后建立。

项目和配置的 version:10 是原有文件格式版本，独立于应用版本。保持读取兼容，后续格式变化使用明确迁移规则。

不配置谱图上传服务器，项目文件由用户下载保存。未指定开源许可证，暂不添加许可文件。


## 小写 URL

GitHub 仓库：https://github.com/imasenHF/spinplot 。网页和 Vite base 均使用 /spinplot/。旧 /SpinPlot/ 及深层地址由主站兼容页转到对应小写地址，查询参数及锚点保留。
