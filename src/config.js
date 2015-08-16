System.config({
  "baseURL": "/",
  "transpiler": "babel",
  "babelOptions": {
    "optional": [
      "runtime"
    ]
  },
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "babel": "npm:babel-core@5.5.6",
    "babel-runtime": "npm:babel-runtime@5.5.6",
    "core-js": "npm:core-js@0.9.15",
    "kefir": "npm:kefir@2.7.2",
    "mithril": "npm:mithril@0.2.0",
    "mousetrap": "npm:mousetrap@1.5.3",
    "pixi.js": "npm:pixi.js@3.0.7",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.4.2"
    },
    "github:jspm/nodelibs-events@0.1.1": {
      "events": "npm:events@1.0.2"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "github:jspm/nodelibs-punycode@0.1.0": {
      "punycode": "npm:punycode@1.3.2"
    },
    "github:jspm/nodelibs-querystring@0.1.0": {
      "querystring": "npm:querystring@0.2.0"
    },
    "github:jspm/nodelibs-stream@0.1.0": {
      "stream-browserify": "npm:stream-browserify@1.0.0"
    },
    "github:jspm/nodelibs-url@0.1.0": {
      "url": "npm:url@0.10.3"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:acorn@1.2.2": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0"
    },
    "npm:amdefine@1.0.0": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "module": "github:jspm/nodelibs-module@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:async@0.9.2": {
      "process": "github:jspm/nodelibs-process@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:babel-runtime@5.5.6": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:brfs@1.4.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "quote-stream": "npm:quote-stream@1.0.1",
      "resolve": "npm:resolve@1.1.6",
      "static-module": "npm:static-module@1.1.3",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0",
      "through2": "npm:through2@2.0.0"
    },
    "npm:buffer@3.4.2": {
      "base64-js": "npm:base64-js@0.0.8",
      "ieee754": "npm:ieee754@1.1.6",
      "is-array": "npm:is-array@1.0.1"
    },
    "npm:concat-stream@1.4.10": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "inherits": "npm:inherits@2.0.1",
      "readable-stream": "npm:readable-stream@1.1.13",
      "typedarray": "npm:typedarray@0.0.6"
    },
    "npm:core-js@0.9.15": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:core-util-is@1.0.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:duplexer2@0.0.2": {
      "readable-stream": "npm:readable-stream@1.1.13"
    },
    "npm:earcut@2.0.2": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:escodegen@0.0.28": {
      "esprima": "npm:esprima@1.0.4",
      "estraverse": "npm:estraverse@1.3.2",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "source-map": "npm:source-map@0.1.43",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:escodegen@1.3.3": {
      "esprima": "npm:esprima@1.1.1",
      "estraverse": "npm:estraverse@1.5.1",
      "esutils": "npm:esutils@1.0.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "source-map": "npm:source-map@0.1.43",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:esprima@1.0.4": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:esprima@1.1.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:falafel@1.2.0": {
      "acorn": "npm:acorn@1.2.2",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "foreach": "npm:foreach@2.0.5",
      "isarray": "npm:isarray@0.0.1",
      "object-keys": "npm:object-keys@1.0.7"
    },
    "npm:has@1.0.1": {
      "function-bind": "npm:function-bind@1.0.2"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:kefir@2.7.2": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:mousetrap@1.5.3": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:pixi.js@3.0.7": {
      "async": "npm:async@0.9.2",
      "brfs": "npm:brfs@1.4.1",
      "earcut": "npm:earcut@2.0.2",
      "eventemitter3": "npm:eventemitter3@1.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "object-assign": "npm:object-assign@2.1.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "punycode": "github:jspm/nodelibs-punycode@0.1.0",
      "querystring": "github:jspm/nodelibs-querystring@0.1.0",
      "resource-loader": "npm:resource-loader@1.6.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0"
    },
    "npm:process-nextick-args@1.0.2": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:punycode@1.3.2": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:quote-stream@0.0.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "minimist": "npm:minimist@0.0.8",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "through2": "npm:through2@0.4.2"
    },
    "npm:quote-stream@1.0.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "minimist": "npm:minimist@1.1.3",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "through2": "npm:through2@2.0.0"
    },
    "npm:readable-stream@1.0.33": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "core-util-is": "npm:core-util-is@1.0.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "isarray": "npm:isarray@0.0.1",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "stream-browserify": "npm:stream-browserify@1.0.0",
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "npm:readable-stream@1.1.13": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "core-util-is": "npm:core-util-is@1.0.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "isarray": "npm:isarray@0.0.1",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "stream-browserify": "npm:stream-browserify@1.0.0",
      "string_decoder": "npm:string_decoder@0.10.31",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:readable-stream@2.0.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "core-util-is": "npm:core-util-is@1.0.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "isarray": "npm:isarray@0.0.1",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "process-nextick-args": "npm:process-nextick-args@1.0.2",
      "string_decoder": "npm:string_decoder@0.10.31",
      "util": "github:jspm/nodelibs-util@0.1.0",
      "util-deprecate": "npm:util-deprecate@1.0.1"
    },
    "npm:resolve@1.1.6": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:resource-loader@1.6.1": {
      "async": "npm:async@0.9.2",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "eventemitter3": "npm:eventemitter3@1.1.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "url": "github:jspm/nodelibs-url@0.1.0"
    },
    "npm:source-map@0.1.43": {
      "amdefine": "npm:amdefine@1.0.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:static-eval@0.2.4": {
      "escodegen": "npm:escodegen@0.0.28"
    },
    "npm:static-module@1.1.3": {
      "concat-stream": "npm:concat-stream@1.4.10",
      "duplexer2": "npm:duplexer2@0.0.2",
      "escodegen": "npm:escodegen@1.3.3",
      "falafel": "npm:falafel@1.2.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "has": "npm:has@1.0.1",
      "object-inspect": "npm:object-inspect@0.4.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "quote-stream": "npm:quote-stream@0.0.0",
      "readable-stream": "npm:readable-stream@1.0.33",
      "shallow-copy": "npm:shallow-copy@0.0.1",
      "static-eval": "npm:static-eval@0.2.4",
      "through2": "npm:through2@0.4.2"
    },
    "npm:stream-browserify@1.0.0": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "readable-stream": "npm:readable-stream@1.1.13"
    },
    "npm:string_decoder@0.10.31": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:through2@0.4.2": {
      "readable-stream": "npm:readable-stream@1.0.33",
      "util": "github:jspm/nodelibs-util@0.1.0",
      "xtend": "npm:xtend@2.1.2"
    },
    "npm:through2@2.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.1",
      "readable-stream": "npm:readable-stream@2.0.2",
      "util": "github:jspm/nodelibs-util@0.1.0",
      "xtend": "npm:xtend@4.0.0"
    },
    "npm:url@0.10.3": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "punycode": "npm:punycode@1.3.2",
      "querystring": "npm:querystring@0.2.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util-deprecate@1.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:xtend@2.1.2": {
      "object-keys": "npm:object-keys@0.4.0"
    }
  }
});

