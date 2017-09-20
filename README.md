# HMB OA Web

推荐通过 nvm 来管理 node 版本：

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash
```

或者通过 wget：
```bash
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash
```

环境
- node 6.9.1
- npm 3.10.8

可以使用 nrm 来进行 npm 源的管理：
```bash
npm install nrm -g
nrm ls
nrm use taobao
```

## 运行

clone 后需要先安装所有依赖：
```bash
npm install
```

然后再运行：
```bash
# 也可以使用 `npm start` 或者 `node run start`
node run
```

可以在 release (production) 环境测试：
```bash
node run start --release
```

关闭 HMR 和 React Hot Loader：
```bash
node run start --no-hmr
```

App 会运行在 [http://localhost:3000/](http://localhost:3000/).

## 工具

IDE 可以自由选择。这里推荐两个 Chrome 插件：

[React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)：
![React Developer Tools](art/react-dev-tools.png "React Developer Tools")
可以查看 Virtual Dom 时的每个组件，以及每个组件的 props，还有整个 React App 层级。

[Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)：
![Redux DevTools](art/redux-dev-tools.png "Redux DevTools")

可以查看 Redux 的状态，包括 Action、Action 产生的 state 变化，甚至还能直接在控制台 dispatch action，十分强大。

## 测试

单元测试使用了 [chai](http://chaijs.com/) 和 [mocha](http://mochajs.org/)，每次 push 前请自觉检查 lint 并进行修复：

```shell
$ npm run lint    # 检查 JavaScript 和 CSS 代码
$ npm run test    # 跑单元测试。或者使用 `npm run test:watch`
```

## 部署

使用在你的 [Firebase console](https://console.firebase.google.com/) 找到的
完整的 Firebase 项目名字更新到 [`run.js`](run.js) 文件中的 `publish` 脚本。
注意完整名字应该会带有一个额外的 ID 后缀。然后运行：

```shell
$ node run publish    # 编译并发布网站到 Firebase, 也可以使用 `npm run publish`
```

如果只需要进行编译，可以运行：

```shell
$ node run build      # 或者使用 `node run build --release` 来进行生产环境编译
```

如果想要在本地模拟生产环境的部署，可以参见 [Production-ish Server](https://github.com/reactjs/react-router-tutorial/blob/master/lessons/11-productionish-server/README.md)，使用 express 和 if-env 快速搭建本地环境。
如果想要探索服务端渲染，可以参见 [Server Rendering](https://github.com/reactjs/react-router-tutorial/blob/master/lessons/13-server-rendering/README.md)。

## 代码规范

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)
- [Airbnb CSS-in-JavaScript Style Guide](https://github.com/airbnb/javascript/tree/master/css-in-javascript)
- [Airbnb CSS / Sass Styleguide](https://github.com/airbnb/css)

## 第三方依赖

- [React](https://facebook.github.io/react/docs/)
- [React Router](https://github.com/ReactTraining/react-router), [React Router Tutorial](https://github.com/reactjs/react-router-tutorial/)
- [React Router Redux](https://github.com/reactjs/react-router-redux)
- [Redux](https://github.com/reactjs/redux)
- [Ant Design](https://github.com/ant-design/ant-design)
- [Immutable.js](https://facebook.github.io/immutable-js/)
- [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension)
- [Validate.js](https://validatejs.org/)
- [Underscore](http://underscorejs.org/)
- [Redux Thunk](https://github.com/gaearon/redux-thunk)
- [keyMirror](https://github.com/STRML/keyMirror)
- [History](https://github.com/ReactJSTraining/history/tree/master/docs#readme)
- [History Wrapper](https://github.com/mjackson/history)
- [FastClick](https://github.com/ftlabs/fastclick)
- etc.

React 里面的[组件生命周期](https://facebook.github.io/react/docs/react-component.html)比较重要。

开发前建议阅读 React、React Router、Redux 以及 Immutable.js，并扫一遍 antd 支持的组件。

尤其是 antd 的栅格布局方式，见[栅格](https://ant.design/components/grid/)，也可以参考[react-flexbox-grid](http://roylee0704.github.io/react-flexbox-grid/)。

### 组件生命周期

#### Mounting

这些函数在组件实例被创建和插入到 DOM 时候会被调用：

- constructor()
- componentWillMount()
- render()
- componentDidMount()

#### Updating

一次更新可能被 props 或者 state 的变化所触发。这些方法会在一个组件重新 render 的时候被调用：

- componentWillReceiveProps()
- shouldComponentUpdate()
- componentWillUpdate()
- render()
- componentDidUpdate()

#### Unmounting

这个方法会在组件从 DOM 上被删除的时候被调用：

- componentWillUnmount()

### 其他 APIs

- setState()
- forceUpdate()

### 类属性

- defaultProps
- displayName
- propTypes

### 实例属性

- props
- state

## 特性

- 通过 [Babel](http://babeljs.io/) 实现的现代 JavaScript 语法 ([ES2015](http://babeljs.io/docs/learn-es2015/)+)，通过 [PostCSS](https://github.com/postcss/postcss) 实现的现代 css 语法<br>
- 通过 [React](http://facebook.github.io/react/), [Webpack](https://webpack.github.io/) 和 [CSS Modules](https://github.com/css-modules/css-modules) 实现的基于组件的 UI 架构<br>
- 通过 [Redux](http://redux.js.org/) 实现的应用状态管理以及时间旅行调试 (见 [`main.js`](main.js), [`core/Store.js`](src/core/Store.js))<br>
- [Code-splitting](https://github.com/webpack/docs/wiki/code-splitting) and async chunk loading via [Webpack](https://webpack.github.io/) and [ES6 System.import()](http://www.2ality.com/2014/09/es6-modules-final.html)<br>
- 热模块替换 ([HMR](https://webpack.github.io/docs/hot-module-replacement.html)) 和 [React Hot Loader](http://gaearon.github.io/react-hot-loader/)<br>
- 跨设备测试使用 [Browsersync](https://browsersync.io/) (见 [`run.js#start`](run.js))<br>

**查看** [docs](./docs), **学习** [React.js 和 ES6](#user-content-learn-reactjs-and-es6)

## 目录结构

```shell
.
├── /components/                # Shared or generic UI components
│   ├── /Button/                # Button component
│   ├── /Layout/                # Website layout component
│   ├── /Link  /                # Link component to be used instead of <a>
│   └── /...                    # etc.
├── /core/                      # Core framework
│   ├── /history.js             # Handles client-side navigation
│   ├── /routes.jsx              # Handles routing
│   └── /Store.js               # Application state manager (Redux)
├── /node_modules/              # 3rd-party libraries and utilities
├── /pages/                     # React components for web pages
│   ├── /about/                 # About page
│   ├── /error/                 # Error page
│   ├── /home/                  # Home page
│   └── /...                    # etc.
├── /public/                    # Static files such as favicon.ico etc.
│   ├── /dist/                  # The folder for compiled output
│   ├── favicon.ico             # Application icon to be displayed in bookmarks
│   ├── robots.txt              # Instructions for search engine crawlers
│   └── /...                    # etc.
├── /test/                      # Unit and integration tests
├── /utils/                     # Utility and helper classes
│── main.js                     # React application entry point
│── package.json                # The list of project dependencies and NPM scripts
│── run.js                      # Build automation script, e.g. `node run build`
└── webpack.config.js           # Bundling and optimization settings for Webpack
```

## Update

You can always fetch and merge the recent changes from this repo back into your own project:

```shell
$ git checkout master
$ git fetch react-static-boilerplate
$ git merge react-static-boilerplate/master
$ npm install
```

## Learn React.js and ES6

- **[React.js Training Program](http://www.reactjsprogram.com/?asdf=36750_q0pu0tfa)** by Tyler McGinnis<br>
- **[React for Beginners](https://reactforbeginners.com/friend/konstantin)** and **[ES6 Training Course](https://es6.io/friend/konstantin)** by Wes Bos<br>
- **[React: Up & Running: Building Web Applications](http://amzn.to/2bBgqhl)** by Stoyan Stefanov (Aug, 2016)<br>
- **[Getting Started with React](http://amzn.to/2bmwP5V)** by Doel Sengupta and Manu Singhal (Apr, 2016)<br>
- **[You Don't Know JS: ES6 & Beyond](http://amzn.to/2bBfVnp)** by Kyle Simpson (Dec, 2015)<br>
