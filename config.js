module.exports = {
    'cwd': './src/comp',
    'contentTpl': {
        'tpl': '<div class="o-{{comp}}">{{EOL}}</div>',
        'scss': '.o-{{comp}} {{{EOL}}}',
        'js': "define('comp/{{comp}}/index', [{{deps}}], function ({{depsVars}}) {{{EOL}}})",
    },
    'baseDeps': ['base/compbase'],
    'varRegx' : {
        'baseDep': [/.+\/([^\/]+)'$/, '$$$1'],
        'tpl': [/([^\.]+).+$/g, '$$$1Tpl']
    },
    'extension': {
        'tpl': 'html',
        'scss': 'scss',
    },
    'defaultName': {
        'js': 'index',
        'scss': 'base',
        'tpl': 'main'
    }
}
