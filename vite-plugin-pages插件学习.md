官方文档传送门： [vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages)

简单记录一下各种路由的组织方式，安装方式同学们直接在官方文档看就可以了。

## 配置属性

### 指定需要生成路由的文件夹

类型：string | array<string>

默认路径为 **src/pages**

```ts
Pages({
  // default
  pagesDir: 'src/pages'
})
```

可以自行修改

```ts
Pages({
  pagesDir: [
   { dir: 'src/pages', baseRoute: '' },
   // src/features/pages文件夹下会生成/features/filename这样的路由
   { dir: 'src/features/pages', baseRoute: 'features' },
   // 会识别fruits下多个分类下pages的文件
   { dir: 'src/fruits/**/pages', baseRoute: 'fruits' },
  ],
})
```

### 指定需要生成路由的文件

类型： array<string>

```ts
Pages({
  // 识别带有vue和md后缀的文件为路由（md文件需要有插件支持）
  extensions: ['vue', 'md'],
}
```

### 加载方式

类型:  'sync' | 'async' |  (stirng)=> 'sync' : 'async'

可以直接设定全局的路由加载方式，也可以通过设置**syncIndex**配置项来转换为同步加载

也可以通过传入一个方法，通过返回 **sync** 和 **async** 来确定加载方式

```ts
Pages({
  importMode: 'async',
  // 只要包含fruits的路由，就会变为异步懒加载
  // importMode(path) {
  //   return path.includes('fruits') ? 'async' : 'sync'
  // },
})
```



### 路由块语言类型

类型：string

在使用自动化路由插件之后，我们的一些路由信息就没有写在config文件中了，所以在SFC文件中，可以用route标签来填写一些必要的路由信息。

```ts
Pages({
  routeBlockLang: 'json5',
})
```

默认会使用json5(即我们常见的对象语法)的方式来写

```
<route>
{
  meta: {
    layout: 'default'
  }
}
</route>
```

如果不使用默认，可以自己指定使用yaml的方式编写route代码块

```vue
<route lang="yaml">
meta:
  layout: 404
</route>
```



### 替换方括号（实验中）（看官方issue好像是有问题的，我没有测试成功）

类型： boolean

这个配置是将识别动态路由的 **[ ]** 换成识别 **_** 前缀，跟nuxtjs的风格相似



### nuxtStyle路由风格

应该是比较人性化，方便nuxtjs迁移过来？



### route处理方法

类型： function

写入之后，我们可以通过这个方法获取到单个路由对象，从而对这个对象进行一定的操作，比如设置身份校验，设置layout

```typescript
      extendRoute(route) {
        // console.log(route.path)
        // 这里为了测试这个方法的效果，就是判断一下路由中包含了fruit字符串的，更换layout
        if (route.path.includes('fruit')) {
          return {
            ...route,
            meta: { layout: 'home' },
          }
        }
        return route
      },
```



### routes处理方法

类型： function

写入之后，可以获取到完整的array<route>，通过循环遍历获取之后对route进行处理

```typescript
      // 整体处理整个routes的信息，然后进行相应的处理
      onRoutesGenerated(routes) {
        const temp_routes = JSON.parse(JSON.stringify(routes))
        temp_routes.forEach((item: any) => {
          // 这里依然是判断一下路由中包含了fruit字符串的，更换layout
          if (item.path.includes('fruit')) {
            item.meta = {
              layout: 'home',
            }
          }
        })
        return temp_routes
      },
```



### clientCode处理方法

类型：function

写入之后可以获取到整个插件渲染之后的代码，这里我们可以在这里通过字符串操作，对这个代码进行最后的拦截处理。

```typescript
      // 这里涉及到更改客户端代码
      onClientGenerated(clientCode) {
        // 能够完整获取到我们实际生成的路由的完整代码，string格式的，
        // 感觉可以通过正则对这个方法进行替换，或者各种字符串骚操作进行替换
        return clientCode
      },
```



## 常见使用场景

