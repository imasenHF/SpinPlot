# SpinPlot

浏览器端 CW EPR 数据处理与作图软件。作者：hyphoon；联系：wuhaifeng@ustc.edu.cn。

## 当前状态

React + TypeScript + Vite 项目骨架已建立。现有 V26 位于 public/legacy/index.html，首页提供使用入口。算法及交互尚未迁移，不能将项目骨架视为模块化软件已完成。PDF 基础字体不支持中文，中文标签使用 SVG。V26 浏览器功能需要继续核对。

## 开发

使用 Node.js 22 或兼容的较新版本。

```sh
npm ci
npm run dev
npm run build
npm run preview
```

## 发布

main 提交触发 .github/workflows/pages.yml，发布 dist。Vite base 固定为 /SpinPlot/，对应项目站路径。GitHub Pages Source 应为 GitHub Actions；自动启用失败时需在 Settings → Pages 手动选择。暂不设置 Custom domain。

项目介绍计划放在主站 /projects/spinplot/，该介绍页本仓库不负责发布。

## 目录

src 为新界面；public/legacy 为迁移期 V26；docs/ARCHITECTURE.md 记录有效设计和验收条件。

不配置谱图上传服务器。项目文件由用户下载保存，未来浏览器草稿不代替备份。未指定开源许可证，暂不添加许可文件。
