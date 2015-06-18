#组件化脚手架
内部组件化脚手架程序

##usage

    ./node_modules/index.js

##option

    -o, --comp [name]:  init a compoment : required
    -r, --cwd  [name]:  set a cwd, default is src/comp
    -b, --base [name]:  set a cwd, default is src/comp
    -t, --tpl  [name]:  init a tpl   file, default [name] is main 
    -s, --scss [name]:  init a scss  file, default [name] is base 
    -j, --js   [name]:  init a entry file, default [name] is index
    -f, --force      :  init a compoment, remove the old one if extis
    -c, --clear      :  clear a component, remove all file in the component dir

##sample
    
    ./node_modules/index.js -r './' -o test 
    ./node_modules/index.js -r './' -o test -c 
    ./node_modules/index.js -r './' -o test -fjts 
    ./node_modules/index.js -r './' -o test -s common -j entry
