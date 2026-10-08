# 模块化第一阶段预览记录

状态：**预览分支，未合并正式 main，未发布到 plastocyanin.org**。

- 临时分支：`preview/modularization-phase1-20261009`
- 源分支基线：`main` @ `3dfd126ae0a2af5ef836233f181dd2b757f2e64c`
- 目标：不改变功能与文件格式，移除内联 CSS/JS，抽出可单测的数值处理函数。

## 第一阶段修改

1. `index.html`：保留 HTML 与控件 DOM，CSS 改由 `src/styles/app.css` 引入，脚本改由 `src/main.js` 引入。
2. `src/main.js`：保留原始处理与界面行为；现有二维模块仍以相对路径导入。版本号改由 `package.json` 导入，避免从内联脚本移出后原本的 HTML 版本字符串替换失效。
3. `src/core/numeric.js`：提取现有 `clamp`、`mean`、`median`、`ptp`、`robustSigma`、`diff`、`finiteNum`、`parseNumberList`、`parseRegions`，保留实现与调用含义；`numeric.test.js` 为新增回归测试。
4. `.github/workflows/modularization-preview.yml`：仅在预览分支触发测试、构建和 artifact 上传，不部署 Pages 或覆盖生产站点。

## 本阶段边界

- 未改动数据解析语义、物理单位、矩阵计算、渲染算法和导出格式。
- 应用版本保留 `0.9.2`；项目格式 11、配置格式 10 不变。
- 当前还没有独立临时仓库或公开 Pages 预览 URL；本仓库可用的连接工具不包含创建新仓库操作，先以隔离分支 + GitHub Actions 可下载构建包提供预览。此形式可运行本地 `npm ci && npm run dev` 查看。
- 未来若有单独临时仓库，必须使用独立的部署地址与 Vite base，不能将该预览环境覆盖正式 `/spinplot/`。

## 验收

```bash
npm ci
node --test src/core/numeric.test.js
node src/twod/core.test.js
node src/twod/bes3t.test.js
node src/twod/large.test.js
node src/twod/integration.test.js
node src/twod/ticks.test.js
npm run build
```

真实仪器文件、旧项目版本、完整浏览器操作和多种导出结果需要额外检查。GitHub Actions 上传 artifact 仅代表通过脚本层检查与构建，不等同于实际页面交互通过。
