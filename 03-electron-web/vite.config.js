import { defineConfig, normalizePath } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
// import autoprefixer from 'autoprefixer';
// import vueJsx from '@vitejs/plugin-vue-jsx';
// import svgLoader from 'vite-svg-loader';
// import viteImagemin from 'vite-plugin-imagemin';
// import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
// import legacy from '@vitejs/plugin-legacy';
// import { visualizer } from "rollup-plugin-visualizer";
console.log('命令执行目录', process.cwd());
console.log('当前文件目录', __dirname);

// 全局 scss 文件的路径
// 用 normalizePath 解决 window 下的路径问题
// const variablePath = normalizePath(path.resolve('./src/style/global.scss'));
// const baseURL = process.env.NODE_ENV === 'production' ? 'http://127.0.0.1:5500/vite01init/dist/' : './';
const baseURL = process.env.NODE_ENV === 'production' ? './' : './';
// https://vitejs.dev/config/
export default defineConfig({
  // 手动指定项目根目录位置
  root: path.join(__dirname, 'src/renderer'),
  // root: path.join(__dirname), // 默认是项目根目录，会默认把这里的index.html文件显示出来
  base: baseURL, //(打包后生效) 设置 base 为相对路径,如果设置为/绝对路径，会找不到静态资源
  server: {
    // https 选项需要开启
    https: false,
    port: 5175, // 指定端口
  },
  optimizeDeps: {
    // 预构建配置
    // 为一个字符串数组(默认会扫描所有html文件)
    // entries: ["./src/index.html", "**/*.vue"],
    // 配置为一个字符串数组，将 `lodash-es` 和 `vue`两个包强制进行预构建(很有用，比如可以强制预构建动态import)
    // include: ["lodash-es", "vue"],
    // 将某些包从预构建排除(不常用)
    // exclude: ["@loadable/component"],
    // 自定义esbuild行为
    esbuildOptions: {
      plugins: [
        // 加入 Esbuild 插件
      ]
    }
  },
  resolve: {
    // 别名配置
    alias: {
      '@assets': path.join(__dirname, 'src/assets'),
      '@': path.join(__dirname, 'src')
    },
    extensions: ['.js', '.vue', '.jsx', '.json'] // 自动补全 .js, .jsx, .json 扩展名
  },
  // css 相关的配置
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData 的内容会在每个 scss 文件的开头自动注入
        // additionalData: `@import "${variablePath}";`
      }
    },
    // 进行 PostCSS 配置
    postcss: {
      plugins: [
        // autoprefixer({
        //   // 指定目标浏览器
        //   overrideBrowserslist: ['Chrome > 40', 'ff > 31', 'ie 11']
        // })
      ]
    }
  },
  json: {
    stringify: true // 禁止son按名导入 这样会将 JSON 的内容解析为export default JSON.parse("xxx")，这样会失去按名导出的能力，不过在 JSON 数据量比较大的时候，可以优化解析性能。
  },
  assetsInclude: ['.gltf'], // 如果你的项目中还存在其它格式的静态资源，你可以通过assetsInclude配置让 Vite 来支持加载:
  plugins: [
    vue(),
    // vueJsx(), // 支持jsx
    // svgLoader(), // 支持svg组件
    // viteEslint(), // 开发阶段开启eslint检查
    // viteStylelint({ // 样式检查|格式化
    //   // 对某些文件排除检查
    //   exclude: /windicss|node_modules/
    // }),
    // viteImagemin({
    //   // 图片压缩
    //   // 无损压缩配置，无损压缩下图片质量不会变差
    //   optipng: {
    //     optimizationLevel: 7
    //   },
    //   // 有损压缩配置，有损压缩下图片质量可能会变差
    //   pngquant: {
    //     quality: [0.8, 0.9]
    //   },
    //   // svg 优化
    //   svgo: {
    //     plugins: [
    //       {
    //         name: 'removeViewBox'
    //       },
    //       {
    //         name: 'removeEmptyAttrs',
    //         active: false
    //       }
    //     ]
    //   }
    // }),
    // chunkSplitPlugin({
    //   strategy: 'default', // 打包策略 default | all-in-one | unbundle
    //   customChunk: (args)=>{ // 函数形式
    //     // 如果文件路径以 src/pages/ 开头，去掉路径的前 4 个字符，并移除文件扩展名，然后返回修改后的文件路径作为 chunk 名称。
    //     let { file, id, moduleId, root } = args;
    //     if(file.startsWith('src/pages/')){
    //       file = file.substring(4);
    //       file = file.replace(/\.[^.$]+$/, ''); // [^.$]:表示不匹配 .和$字符
    //       return file;
    //     }
    //     return null;
    //   },
    //   customSplitting: { // 对象形式 自定义拆包
    //     // 'vue-vendor': ['vue'], // 将vue单独打包成vue-vendor 会报错找不到vue，我们用manualChunks将vue单独拆出来把
    //     'vue-vendor': [/\/vue\//], // 临时解决
    //     // Any file that includes `utils` in src dir will be bundled in the `utils` chunk
    //     'utils': [/src\/utils/], // 将utils文件夹下的文件打包成一个包
    //   }
    // }),
    // legacy({
    //   // 设置目标浏览器，browserslist 配置语法
    //   targets: ['ie >= 11'],
    // }),
    // mkcert(), // 在本地 Dev Server 上开启 HTTP2  因为下载不了证书，暂时不打开,有需要再研究
    // visualizer({
    //   // 打包完成后自动打开浏览器，显示产物体积报告
    //   open: false, // 如果要开启 设置为true
    // }), 
  ],
  build: {
    // js压缩相关======
    // 类型: boolean | 'esbuild' | 'terser'
    // 默认为 `esbuild`
    minify: 'esbuild',
    // 产物目标环境
    target: 'es2015', // 默认是modules 代表 ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1']  、 'es2015/es6'
    // 如果 minify 为 terser，可以通过下面的参数配置具体行为
    // https://terser.org/docs/api-reference#minify-options
    terserOptions: {},
    // js压缩相关======
    // css压缩相关=======
    // 设置 CSS 的目标环境
    // cssTarget: '', // 一般不需要设置
    // css压缩相关=======
    // 图片是否内敛的临界值 4 KB; 大于等于这个值将打包成单文件，小于这个值将内联
    assetsInlineLimit: 4 * 1024,
    // rollupOptions: {
    //   output: {
    //     // manualChunks 配置 自定义拆包(下面是两种形式，对象形式，函数形式)，如果不想自己处理依赖(避免循环依赖，使用vite-plugin-chunk-split插件)
    //     // // 对象形式
    //     // manualChunks: { 
    //     //   // 将 React 相关库打包成单独的 chunk 中
    //     //   // 'vue-vendor': ['vue'], // key代表chunk名称，键是第三方包的包名组成的数组
    //     //   // 将 Lodash 库的代码单独打包 项目中没有的库写在这会报错
    //     //   // 'lodash': ['lodash-es'],
    //     //   // // 将组件库的代码打包
    //     //   // 'library': ['antd', '@arco-design/web-react'],
    //     // },
    //     // // 函数形式
    //     // manualChunks(id) { // 用函数的形式实现一遍  下面的配置过于简单粗暴，如果没有将依赖全部打包在一起，很容易引起循环依赖
    //     //   // if (id.includes('antd') || id.includes('@arco-design/web-react')) {
    //     //   //   return 'library';
    //     //   // }
    //     //   // if (id.includes('lodash')) {
    //     //   //   return 'lodash';
    //     //   // }
    //     //   if (id.includes('vue')) {
    //     //     return 'vue-vendor';
    //     //   }
    //     // }
    //   },
    // }
  }
});
