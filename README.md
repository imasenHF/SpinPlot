# SpinPlot

浏览器端 CW EPR 数据处理与作图工具。作者：hyphoon。

[打开软件](https://plastocyanin.org/spinplot/) · [版本记录](CHANGELOG.md)

## 功能与使用范围

支持数据读取、多谱绘图、频率设置、基线处理、标注、磁场测距及矢量导出。项目与配置可下载保存；本项目未配置谱图上传服务器。

PDF基础字体不支持中文，包含中文标签时可使用SVG导出。完整浏览器数据操作尚未全面验收，重要数据处理结果应与原始谱图核对。

## 本地运行

使用Node.js 22或兼容版本：

```sh
npm ci
npm run dev
```

构建与预览：

```sh
npm run build
npm run preview
```

构建包含TypeScript检查，输出位于 `dist/`。main分支提交通过GitHub Actions发布，Vite基础路径为 `/spinplot/`。

## 版本与文件兼容

应用版本以 `package.json` 的 `version` 为准，并写入页面、About与保存文件的 `appVersion`。版本变更记录于 [CHANGELOG.md](CHANGELOG.md)，使用MAJOR.MINOR.PATCH。

项目与配置的 `version: 10` 表示文件格式，独立于应用版本。格式修改需说明兼容性和迁移方式。发布标签应在构建与部署检查后建立。

## 代码结构

现有计算与交互代码主要位于 `index.html`。TypeScript/React依赖用于后续模块化迁移，当前迁移尚未完成，计划见 [ARCHITECTURE.md](docs/ARCHITECTURE.md)。

正式网页入口为 `/spinplot/`；旧 `/spinplot/legacy/` 跳转首页，主站兼容页保留旧大写入口的查询参数与锚点。

## 联系与许可

wuhaifeng@ustc.edu.cn

本仓库未指定开源许可证。
