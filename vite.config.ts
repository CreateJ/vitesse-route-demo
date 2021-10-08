import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Markdown from 'vite-plugin-md'
import WindiCSS from 'vite-plugin-windicss'
import { VitePWA } from 'vite-plugin-pwa'
import VueI18n from '@intlify/vite-plugin-vue-i18n'
import Inspect from 'vite-plugin-inspect'
import Prism from 'markdown-it-prism'
import LinkAttributes from 'markdown-it-link-attributes'

const markdownWrapperClasses = 'prose prose-sm m-auto text-left'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      // 识别文件后缀
      extensions: ['vue', 'md'],
      pagesDir: [
        { dir: 'src/pages', baseRoute: '' },
        // src/features/pages文件夹下会生成/features/filename这样的路由
        { dir: 'src/features/pages', baseRoute: 'features' },
        // 会识别fruits下多个分类下pages的文件
        { dir: 'src/fruits/**/pages', baseRoute: 'fruits' },
      ],
      // 当识别到的文件路径包含以下字段时，会自动剔除，比如我们的一些特定的小组件
      exclude: ['**/components/*'], // 这里的作用是将src目录下，不将含有component字段的组件生成为页面
      // 引入模式
      importMode: 'async',
      // 只要包含fruits的路由，使用异步懒加载方式,
      // 解除注释即可在页面中看到使用不同的layout即已生效
      // importMode(path) {
      //   return path.includes('fruits') ? 'async' : 'sync'
      // },
      // 将'[]'替换为'_',未测试成功
      // replaceSquareBrackets: true,
      // 单独判断每一个路由，返回一个新的路由or原路由
      // extendRoute(route) {
      //   // console.log(route.path)
      //   // 这里为了测试这个方法的效果，就是判断一下路由中包含了fruit字符串的，更换layout
      //   if (route.path.includes('fruit')) {
      //     return {
      //       ...route,
      //       meta: { layout: 'home' },
      //     }
      //   }
      //   return route
      // },
      // 整体处理整个routes的信息，然后进行相应的处理
      // onRoutesGenerated(routes) {
      //   const temp_routes = JSON.parse(JSON.stringify(routes))
      //   temp_routes.forEach((item: any) => {
      //     // 这里依然是判断一下路由中包含了fruit字符串的，更换layout
      //     if (item.path.includes('fruit')) {
      //       item.meta = {
      //         layout: 'home',
      //       }
      //     }
      //   })
      //   return temp_routes
      // },
      // 这里涉及到更改客户端代码
      // onClientGenerated(clientCode) {
      //   // 能够完整获取到我们实际生成的路由的完整代码，string格式的，
      //   // 感觉可以通过正则对这个方法进行替换，或者各种字符串骚操作进行替换
      //   return clientCode
      // },
      // 配置SFC文件中，route块的默认语言
      routeBlockLang: 'json5',
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        '@vueuse/head',
        '@vueuse/core',
      ],
      dts: 'src/auto-imports.d.ts',
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],

      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],

      // custom resolvers
      resolvers: [
        // auto import icons
        // https://github.com/antfu/unplugin-icons
        IconsResolver({
          componentPrefix: '',
          // enabledCollections: ['carbon']
        }),
        ElementPlusResolver(),
      ],

      dts: 'src/components.d.ts',
    }),

    // https://github.com/antfu/unplugin-icons
    Icons(),

    // https://github.com/antfu/vite-plugin-windicss
    WindiCSS({
      safelist: markdownWrapperClasses,
    }),

    // https://github.com/antfu/vite-plugin-md
    // Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
    Markdown({
      wrapperClasses: markdownWrapperClasses,
      headEnabled: true,
      markdownItSetup(md) {
        // https://prismjs.com/
        md.use(Prism)
        md.use(LinkAttributes, {
          pattern: /^https?:\/\//,
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        })
      },
    }),

    // https://github.com/antfu/vite-plugin-pwa
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'safari-pinned-tab.svg'],
      manifest: {
        name: 'Vitesse',
        short_name: 'Vitesse',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),

    // https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      include: [path.resolve(__dirname, 'locales/**')],
    }),

    // https://github.com/antfu/vite-plugin-inspect
    Inspect({
      // change this to enable inspect for debugging
      enabled: false,
    }),
  ],

  server: {
    fs: {
      strict: true,
    },
  },

  // https://github.com/antfu/vite-ssg
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
  },

  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
      '@vueuse/head',
    ],
    exclude: [
      'vue-demi',
    ],
  },
})
