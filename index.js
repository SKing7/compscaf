#!/usr/bin/env node

var program = require('commander');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');

var defaultConfig = require('./config.js');

var userConfig;
if (fs.existsSync(userConfig)) {
    userConfig = require(path.join(process.cwd(), '.compscaf'));
}

 
var config = _.assign({}, defaultConfig, userConfig);
var compRoot = config.cwd;
var contentMap = config.contentTpl;
var regx = config.varRegx;
var extension = config.extension;
var defaultNames = config.defaultName;

program
  .version('0.0.1')
  .option('-o, --comp [name]', 'init a compoment : required')
  .option('-t, --tpl  [name]', 'init a tpl   file, default is main ')
  .option('-s, --css [name]', 'init a css  file, default is base ')
  .option('-j, --js   [name]', 'init a entry file, default is index')
  .option('-a, --all', 'init all file[tpl/css/js]')
  .option('-f, --force', 'init a compoment, remove the old one if extis')
  .option('-c, --clear', 'clear a component, remove all file in the component dir')
  .parse(process.argv);
 

var initDeps = function (deps) {
    var deps = config.baseDeps || [];
    _.forEach(deps, function (dep, k) {
        deps[k] = "'" + dep + "'";
    });
    return deps;
}
var parseDepName = function (dep, regx) {
    return '$' + dep.replace(regx[0], regx[1]);
}
var initDepsVars = function (deps) {
    var depsVars =  [];
    var baseRegx = regx.baseDep;
    _.forEach(deps, function (dep) {
        depsVars.push(parseDepName(dep, baseRegx));
    });
    return depsVars;
}

starter();

function starter() {
    var compName = program.comp;
    var force = program.force;
    var isClear = program.clear;

    var TYPE = Object.prototype.toString,
        STRING = TYPE.call(''),
        BOOL = TYPE.call(true);

    if (isClear) {
        clear();
        return;
    }
    var deps = initDeps();
    var depsVars = initDepsVars(deps);
    if (!initComponent(compName)) {
        initFiles('tpl')
        initFiles('css')
        initFiles('js') 
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
    function initFiles(type) {
        var o = program[type] || program.all;
        var regxType = regx[type]; 
        var extType = extension[type] || type;
        var defaultName = defaultNames[type]; 
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
        targetName += '.' + extType;
        fullPath = path.resolve(path.join(compRoot, compName, targetName));
        contentTpl = compiler(contentTpl, {
            comp: compName,
            deps: deps.join(', '),
            depsVars: depsVars.join(', ')
        });
        fs.writeFileSync(fullPath, contentTpl)
        deps.push("'./" + targetName + "'");
        if (regxType && regxType.length === 2) {
            depsVars.push(parseDepName(targetName, regxType));
        }
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
