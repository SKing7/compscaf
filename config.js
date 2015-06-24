module.exports = {
    'cwd': './',
    'contentTpl': {
        'tpl': '<div class="o-{{comp}}"></div>',
        'css': '.o-{{comp}} {\r\n}',
        'js': 'define("comp/{{comp}}/index", [{{deps}}], function ({{depsVars}}) {\r\n})',
    },
    'baseDeps': ['base/compbase'],
    'varRegx' : {
        'baseDep': [/.+\/([^\/]+)$/, '$1'],
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
