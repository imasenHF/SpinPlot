# 模块化第一阶段预览记录

状态：**预览分支，未合并正式 main；构建快照已在主站独立临时路径发布，正式 `/spinplot/` 未变。**

- 临时分支：`preview/modularization-phase1-20261009`
- 源分支基线：`main` @ `3dfd126ae0a2af5ef836233f181dd2b757f2e64c`
- 目标：不改变功能与文件格式，移除内联 CSS/JS，抽出可单测的数值处理函数。

## 第一阶段修改

1. `index.html`：保留 HTML 与控件 DOM，CSS 改由 `src/styles/app.css` 引入，脚本改由 `src/main.js` 引入。
2. `src/main.js`：保留原始处理与界面行为；现有二维模块仍以相对路径导入。版本号改由 `package.json` 导入，避免从内联脚本移出后原本的 HTML 版本字符串替换失效。
3. `src/core/numeric.js`：提取现有 `clamp`、`mean`、`median`、`ptp`、`robustSigma`、`diff`、`finiteNum`、`parseNumberList`、`parseRegions`，保留实现与调用含义；`numeric.test.js` 为新增回归测试。
4. 已将原有 `parseCSV`、`parseMergedCSV`、`interp1` 抽离至 `src/data/csv.js` 和 `src/processing/interpolation.js`，保留函数行为，补充回归测试。
5. `.github/workflows/modularization-preview.yml`：仅在预览分支触发测试与构建、上传 artifact，并把相对路径静态构建写入该分支 `preview-site/`；不直接部署 SpinPlot Pages 或覆盖正式站点。

## 本阶段边界

- 未改动数据解析语义、物理单位、矩阵计算、渲染算法和导出格式。
- 应用版本保留 `0.9.2`；项目格式 11、配置格式 10 不变。
- **可访问临时路径**：`https://plastocyanin.org/previews/spinplot-modularization/`，由主站仓库保存的独立构建快照提供；正式 `/spinplot/` 不改变。相邻 `preview-check.html` 用于检查静态资源。主站 Pages 已发布，独立在线 HTTP 检查及 Chromium 浏览器冒烟测试均成功。
- GitHub Actions 仍在预览分支生成可复用的 `preview-site/` 构建产物，采用相对资源 URL；新构建不会自动同步主站上这份独立快照，主站资源需在单独检查后手动更新。
- 未创建独立临时仓库，本项目仅使用隔离分支。预览页作为公开可访问地址，请不要使用未经授权的客户数据或内部文件测试。
- 未来若有单独临时仓库，必须使用独立的部署地址与 Vite base，不能将该预览环境覆盖正式 `/spinplot/`。

## 验收

```bash
npm ci
node --test src/core/numeric.test.js
node --test src/data/csv.test.js
node --test src/processing/interpolation.test.js
node src/twod/core.test.js
node src/twod/bes3t.test.js
node src/twod/large.test.js
node src/twod/integration.test.js
node src/twod/ticks.test.js
npm run build
```

已完成检查：

- [代码与二维回归、Vite 构建（37810791507）](https://github.com/imasenHF/spinplot/actions/runs/37810791507)：通过。
- [公网 HTTP 资源检查（37811149930）](https://github.com/imasenHF/spinplot/actions/runs/37811149930)：HTML、JS、CSS 及资源检查页面均可访问。
- [Chromium 浏览器冒烟测试（37811329698）](https://github.com/imasenHF/spinplot/actions/runs/37811329698)：六个选项卡、合成一维 CSV 导入和导出通过；宽屏/窄屏截图已上传到该次运行的 Artifacts。
- [主站预览快照 Pages 发布（37810978440）](https://github.com/imasenHF/imasenhf.github.io/actions/runs/37810978440)：通过。后续更新预览快照对应另一主站提交，需要按最新运行核对。

尚未检查：真实仪器文件、旧项目版本 9/10/11 的兼容加载、二维真实数据、复杂绘图交互、SVG/PDF 中文导出及结果数值误差。这些不因冒烟测试成功而视为验收完成。

**预览清理规则**：完成审查或决定弃用本实验分支后，移除主站 `previews/spinplot-modularization/` 文件，并从 `SITE_CONTEXT.md` 删除临时入口；是否合并 PR 单独决定，不能自动把预览代码当作正式实现。
