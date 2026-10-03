import { defineConfig } from 'vite';
import packageJson from './package.json';
export default defineConfig({
  base: '/SpinPlot/',
  plugins: [{
    name: 'spinplot-version',
    transformIndexHtml(html) {
      return html.replaceAll('__SPINPLOT_VERSION__', packageJson.version);
    },
  }],
});
