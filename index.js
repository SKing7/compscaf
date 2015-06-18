#!/usr/bin/env node

var program = require('commander');
var path = require('path');
var fs = require('fs');
 
var compRoot = 'src/comp'
var contentMap = {
    'tpl': '',
    'scss': '.o-{{componentName}} {\r\n}',
    'js': "define('comp/{{componentName}}/index', [{{deps}}], function () {\r\n})",
}
program
  .version('0.0.1')
  .option('-r, --cwd [name]', 'set a cwd, default is src/comp')
  .option('-o, --comp [name]', 'init a compoment : required')
  .option('-t, --tpl  [name]', 'init a tpl   file, default is main ')
  .option('-s, --scss [name]', 'init a scss  file, default is base ')
  .option('-j, --js   [name]', 'init a entry file, default is index')
  .option('-a, --all', 'init all file[tpl/scss/js]')
  .option('-f, --force', 'init a compoment, remove the old one if extis')
  .option('-c, --clear', 'clear a component, remove all file in the component dir')
  .parse(process.argv);
 
starter();

function starter() {
    var compName = program.comp;
    var force = program.force;
    var isClear = program.clear;
    var cwd = program.cwd;

    var TYPE = Object.prototype.toString,
        STRING = TYPE.call(''),
        BOOL = TYPE.call(true);

    if (TYPE.call(cwd) === STRING) {
        compRoot = cwd;
    }
    if (isClear) {
        clear();
        return;
    }
    var deps = [];
    if (!initComponent(compName)) {
        initFiles('tpl', 'main', 'html')
        initFiles('scss', 'base', 'scss')
        initFiles('js', 'index', 'js')
    }

    function initComponent(o) {
        var status = 0;
        if (TYPE.call(o) === STRING) {
            initDir();
        } else {
            status = 2;
            makeError( 'option:comp is required');
            return status;
        }
        function initDir() {
            var fullPath;
            fullPath = path.resolve(path.join(compRoot, compName));
            try {
                fs.mkdirSync(fullPath);
            } catch(e) {
                if (force && e.code == 'EEXIST') {
                    rmDir(fullPath);
                    initDir();
                } else {
                    status = 1;
                    makeError(e);
                }
            }
        }
        return status;
    }
    function clear() {
        var fullPath;
        fullPath = path.resolve(path.join(compRoot, compName));
        rmDir(fullPath);
    }
    function initFiles(type, defaultName, prefix, required) {
        var o = program[type] || program.all;
        if (!o) return;
        var targetName;
        var isError = false;
        var contentTpl = contentMap[type] || ''; 
        var fullPath;
        switch (TYPE.call(o)) {
        case BOOL:
            targetName = defaultName;
            break;
        case STRING:
            targetName = o;
            break;
        default:
            if (required) {
                isError = 1; //label this a error
            } 
            break;
        }
        if (isError === 1) {
            makeError(type + ' is required');
            return isError;
        }
        targetName += '.' + prefix;
        fullPath = path.resolve(path.join(compRoot, compName, targetName));
        contentTpl = compiler(contentTpl, {
            componentName: compName,
            deps: deps.join(', ')
        });
        fs.writeFileSync(fullPath, contentTpl)
        deps.push("'./" + targetName + "'");
    }
}

function compiler(content, data) {
    var keys = Object.keys(data);
    keys.forEach(function (v) {
        content = content.replace(new RegExp('\{\{' + v + '\}\}', 'g'), data[v])
    });
    return content;
}
function makeError(msg) {
    console.error(msg);
}
function rmDir(dirPath, removeSelf) {
    removeSelf = removeSelf || removeSelf === undefined;
    try { 
        var files = fs.readdirSync(dirPath); 
    }
    catch(e) { return; }
    if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
            var filePath = dirPath + '/' + files[i];
            if (fs.statSync(filePath).isFile())
                fs.unlinkSync(filePath);
            else
                rmDir(filePath);
        }
    if (removeSelf) {
        fs.rmdirSync(dirPath);
    }
}
