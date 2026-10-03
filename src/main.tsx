import React from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
function App() {
  return <main><header><a href="https://plastocyanin.org/">plastocyanin</a><span>开发预览 · 0.1.0</span></header><h1>SpinPlot</h1><p className="lead">CW EPR 数据处理与作图</p><p>在浏览器中读取谱图、设置绘图参数并导出结果。当前保留 V26 程序作为迁移期间的使用入口；模块化版本正在建设。</p><a className="launch" href={`${import.meta.env.BASE_URL}legacy/`}>打开 SpinPlot V26 →</a><section><h2>当前状态</h2><p>V26 包含多谱绘图、频率设置、基线处理、标注、磁场测距及矢量导出。PDF 的基础字体不能表示中文标签；中文图请使用 SVG。浏览器交互与导出结果仍需按实际数据核对。</p><p>用户选择的谱图由浏览器读取，本站未配置谱图上传或计算服务器。请使用项目文件保存工作。</p></section><section><h2>开发安排</h2><ol><li>抽离数据解析、单位和频率来源模型。</li><li>抽离纯函数计算与项目格式校验，建立基准数据。</li><li>统一图形模型、预览与矢量导出。</li><li>重建参数界面，再加入峰参数、积分和批处理结果表。</li></ol></section><footer><a href="https://github.com/imasenHF/SpinPlot">代码与开发记录</a><span>hyphoon · <a href="mailto:wuhaifeng@ustc.edu.cn">wuhaifeng@ustc.edu.cn</a></span></footer></main>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
