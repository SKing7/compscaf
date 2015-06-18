#组件化脚手架
内部组件化脚手架程序

##usage

    npm install compscaf

##option

    -o, --comp [name]:  init a compoment : required
    -r, --cwd  [name]:  set a cwd, default is src/comp, relative to process.cwd()
    -t, --tpl  [name]:  init a tpl   file, default [name] is main 
    -s, --scss [name]:  init a scss  file, default [name] is base 
    -j, --js   [name]:  init a entry file, default [name] is index
    -f, --force      :  init a compoment, remove the old one if extis
    -c, --clear      :  clear a component, remove all file in the component dir

##sample
    
    ./node_modules/.bin/compscaf -r './' -o test 
    ./node_modules/.bin/compscaf -r './' -o test -c 
    ./node_modules/.bin/compscaf -r './' -o test -fjts 
    ./node_modules/.bin/compscaf -r './' -o test -s common -j entry


##test

```shell

    ./node_modules/.bin/compscaf -rf 'src/comp' -o searchbox -jst
    #tree src/comp/searchbox
    src/comp/searchbox/
    ├── base.scss
    ├── index.js
    └── main.html
```
