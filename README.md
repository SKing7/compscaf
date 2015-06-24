#组件化脚手架
组件化脚手架程序

##INSTALL

    npm install compscaf

##OPTION

    -o, --comp [name]:  init a compoment : required
    -t, --tpl  [name]:  init a tpl   file, default [name] is main 
    -s, --css [name]:  init a css  file, default [name] is base 
    -j, --js   [name]:  init a entry file, default [name] is index
    -f, --force      :  init a compoment, remove the old one if extis
    -c, --clear      :  clear a component, remove all file in the component dir
    

###USAGE
```shell
    ./node_modules/.bin/compscaf -r './' -o test 
    ./node_modules/.bin/compscaf -r './' -o test -c 
    ./node_modules/.bin/compscaf -r './' -o test -fjts 
    ./node_modules/.bin/compscaf -r './' -o test -s common -j entry
```

##Common Config
自定义配置文件：process.cwd()/.compscaf.js
####cwd
组件目录，相对于process.cwd()
####contentTpl
类型文件对应的初始化内容，目前支持变量

    comp：组件名
    deps：组件依赖
    depsVar：组件变量名
    EOL： 换行符
    
####baseDeps [Array:String]
基础依赖，入口文件的通用依赖模块
####varRegx[Object{:type-> Array[RegExp, replacement]}]
变量匹配正则
####extension[Object{:type-> String}]
文件扩展名
####defaultName[Object{:type-> String}]
默认文件名（不含文件后缀）

###USAGE
```js
module.exports = {
    'cwd': './src/comp',
    'contentTpl': {
        'tpl': '<div class="o-{{comp}}"></div>',
        'css': '.o-{{comp}} {\r\n}',
        'js': "define('comp/{{comp}}/index', [{{deps}}], function ({{depsVars}}) {\r\n})",
    },
    'baseDeps': ['base/compbase'],
    'varRegx' : {
        'baseDep': [/.+\/([^\/]+)'$/, '$1'],
        'tpl': [/^([^\.]+).+$/g, '$1Tpl']
    },
    'extension': {
        'tpl': 'html'
    },
    'defaultName': {
        'js': 'index',
        'css': 'base',
        'tpl': 'main'
    }
}
```
##TEST

```shell

    ./node_modules/.bin/compscaf -rf 'src/comp' -o searchbox -jst
    #tree src/comp/searchbox
    src/comp/searchbox/
    ├── base.scss
    ├── index.js
    └── main.html
```
