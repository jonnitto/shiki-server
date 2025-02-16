export const FusionSyntax = {
    $schema: "https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json",
    name: "Fusion",
    scopeName: "source.fusion",
    patterns: [
        {
            include: "#statements",
        },
        {
            include: "#documentation",
        },
        {
            include: "#comments",
        },
    ],
    injections: {
        "L:meta.tag": {
            patterns: [
                {
                    include: "#injections_afx",
                },
            ],
        },
    },
    repository: {
        statements: {
            patterns: [
                {
                    include: "#keywords",
                },
                {
                    include: "#dsl",
                },
                {
                    include: "#statement_include",
                },
                {
                    include: "#statement_prototype",
                },
                {
                    include: "#operators",
                },
                {
                    include: "#strings",
                },
                {
                    include: "#literals",
                },
                {
                    include: "#eel_value",
                },
                {
                    include: "#helper_prototype_name",
                },
                {
                    include: "#statement_object_path",
                },
            ],
            repository: {
                keywords: {
                    patterns: [
                        {
                            name: "keyword.control.fusion",
                            match: "(@if)|(@position)",
                            captures: {
                                "1": {
                                    name: "keyword.control.if.fusion",
                                },
                                "2": {
                                    name: "keyword.control.position.fusion",
                                },
                            },
                        },
                    ],
                },
                operators: {
                    name: "keyword.operator.fusion",
                    match: "(<)|(>)|(=)",
                    captures: {
                        "1": {
                            name: "keyword.operator.copy.fusion",
                        },
                        "2": {
                            name: "keyword.operator.unset.fusion",
                        },
                        "3": {
                            name: "keyword.operator.assign.fusion",
                        },
                    },
                },
                literals: {
                    include: [
                        {
                            include: "#strings",
                        },
                    ],
                    patterns: [
                        {
                            match: "(null|NULL)",
                            name: "constant.language.null.fusion",
                        },
                        {
                            comment: "Boolean",
                            patterns: [
                                {
                                    match: "(true|TRUE)",
                                    name: "constant.language.true.fusion",
                                },
                                {
                                    match: "(false|FALSE)",
                                    name: "constant.language.false.fusion",
                                },
                            ],
                        },
                        {
                            comment: "Numbers",
                            patterns: [
                                {
                                    match: "-?\\d+(?!\\.\\d+)",
                                    name: "constant.numeric.integer.fusion",
                                },
                                {
                                    match: "-?\\d+\\.\\d+",
                                    name: "constant.numeric.float.fusion",
                                },
                            ],
                        },
                    ],
                },
                statement_object_path: {
                    patterns: [
                        {
                            begin: "(@[\\w\\d_\\-]+)|([\\w\\d_\\-]+)|('.*?')|(\".*?\")",
                            beginCaptures: {
                                "1": {
                                    name: "entity.other.attribute-name.fusion",
                                },
                                "2": {
                                    comment:
                                        "TODO: Set first property path element to 'variable.parameter...' but only inside prototype() blocks",
                                    name: "variable.other.fusion",
                                },
                                "3": {
                                    name: "string.quoted.single.fusion",
                                },
                                "4": {
                                    name: "string.quoted.double.fusion",
                                },
                            },
                            end: "\\G",
                            patterns: [
                                {
                                    match: "\\.",
                                },
                                {
                                    include: "#statement_prototype",
                                },
                                {
                                    include: "#strings",
                                },
                            ],
                        },
                    ],
                },
                statement_include: {
                    name: "support.other.include.fusion",
                    match: "(include):\\s+(.*)",
                    captures: {
                        "1": {
                            name: "keyword.other.include.fusion",
                        },
                        "2": {
                            name: "string.path.include.fusion",
                        },
                    },
                },
                statement_prototype: {
                    begin: "(prototype)\\(",
                    end: "\\)",
                    beginCaptures: {
                        "1": {
                            name: "keyword.other.prototype.fusion",
                        },
                    },
                    patterns: [
                        {
                            include: "#helper_prototype_name",
                        },
                    ],
                },
                eel_value: {
                    begin: "(\\$\\{)",
                    end: "(\\})",
                    beginCaptures: {
                        "1": {
                            name: "keyword.other.scope.begin.eel.fusion",
                        },
                    },
                    endCaptures: {
                        "1": {
                            name: "keyword.other.scope.end.eel.fusion",
                        },
                    },
                    patterns: [
                        {
                            include: "source.js#expression",
                        },
                    ],
                },
            },
        },
        block: {
            begin: "{",
            beginCaptures: {
                "0": {
                    name: "punctuation.definition.block.begin.fusion",
                },
            },
            end: "}",
            endCaptures: {
                "0": {
                    name: "punctuation.definition.block.end.fusion",
                },
            },
            patterns: [
                {
                    include: "#statements",
                },
            ],
        },
        helper_prototype_name: {
            patterns: [
                {
                    match: "Neos\\.Fusion:[\\w.]+",
                    name: "support.class.neos-fusion.fusion",
                },
                {
                    match: "Neos\\.Neos:[\\w.]+",
                    name: "support.class.neos-neos.fusion",
                },
                {
                    match: "([\\w.]+):[\\w.]+",
                    name: "entity.name.type.prototypeNamespace.$1.fusion",
                },
            ],
        },
        strings: {
            patterns: [
                {
                    name: "string.quoted.double.fusion",
                    begin: '"',
                    end: '"',
                    patterns: [
                        {
                            name: "constant.character.escape.fusion",
                            match: "\\\\.",
                        },
                    ],
                },
                {
                    name: "string.quoted.single.fusion",
                    begin: "'",
                    end: "'",
                    patterns: [
                        {
                            name: "constant.character.escape.fusion",
                            match: "\\\\.",
                        },
                    ],
                },
            ],
        },
        documentation: {
            patterns: [
                {
                    name: "support.type.documentation.property.fusion",
                    comment: "Documentation - Property",
                    match: "(///) ([\\w\\.,\\\\:|{}\"']+(?:<[\\w\\.,\\\\:|{}\"'<>]+>)?)\\s(.*)?",
                    captures: {
                        "1": {
                            name: "entity.name.section.properties.fusion",
                        },
                        "2": {
                            patterns: [
                                {
                                    include: "#helper_prototype_name",
                                },
                                {
                                    match: "\\|",
                                    name: "keyword.operator.logical.documentation.fusion",
                                },
                                {
                                    match: ">|<",
                                    name: "keyword.operator.generics.documentation.fusion",
                                },
                                {
                                    match: "\\]|\\[",
                                    name: "keyword.operator.array.documentation.fusion",
                                },
                                {
                                    match: "(\\\\?\\w+\\\\\\w+(?:\\\\\\w+)*)",
                                    name: "support.class.php",
                                },
                                {
                                    match: "(array|string|number|integer|float|object)",
                                    name: "markup.italic.$1.documentation.fusion",
                                },
                            ],
                        },
                        "3": {
                            name: "markup.quote.documentation.line.text.fusion",
                            patterns: [
                                {
                                    name: "markup.inline.raw.string.fusion",
                                    begin: "`",
                                    end: "`",
                                },
                            ],
                        },
                    },
                },
                {
                    name: "comment.block.documentation.fusion",
                    comment: "Documentation - Prototype",
                    begin: "^(/\\*\\*)(.*)",
                    beginCaptures: {
                        "1": {
                            name: "entity.name.section.prototype.fusion",
                        },
                        "2": {
                            name: "invalid.illegal",
                        },
                    },
                    end: "(\\*\\*/)|(\\*/)",
                    endCaptures: {
                        "1": {
                            name: "entity.name.section.prototype.fusion",
                        },
                        "2": {
                            name: "invalid.deprecated",
                        },
                    },
                    patterns: [
                        {
                            name: "markup.quote.documentation.section.properties.text.fusion",
                            begin: "\\s*(# (Properties|properties))\\s*$",
                            beginCaptures: {
                                "1": {
                                    name: "entity.name.section.properties.fusion",
                                },
                                "2": {
                                    name: "keyword.other.doc.properties.fusion",
                                },
                            },
                            end: "(?=(# )|\\*\\*/)",
                            patterns: [
                                {
                                    match: '^\\s*(\\.)(@?[a-zA-Z_\\.\\-:]+?)(: ([\\w\\.\\\\:|]+)) (= ((?:".*")|\\S+) )?(.+)$',
                                    captures: {
                                        "1": {
                                            name: "comment.fusion",
                                        },
                                        "2": {
                                            name: "variable.other.fusion",
                                            patterns: [
                                                {
                                                    match: "@.*",
                                                    name: "entity.other.attribute-name.fusion",
                                                },
                                            ],
                                        },
                                        "4": {
                                            name: "storage.type",
                                        },
                                        "6": {
                                            name: "constant",
                                        },
                                        "7": {
                                            name: "string.unquoted",
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            name: "markup.quote.documentation.section.$2.text.fusion",
                            begin: "(# (.*))\\s*$",
                            beginCaptures: {
                                "1": {
                                    name: "entity.name.section.$2.fusion",
                                },
                            },
                            end: "(?=(# )|\\*\\*/)",
                            patterns: [
                                {
                                    name: "markup.italic.fusion",
                                    begin: "```html",
                                    end: "```",
                                    patterns: [
                                        {
                                            include: "text.html.derivative",
                                        },
                                    ],
                                },
                                {
                                    name: "markup.italic.fusion",
                                    begin: "```",
                                    end: "```",
                                    patterns: [
                                        {
                                            include: "source.fusion",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            name: "markup.bold.documentation.fusion",
                            match: ".",
                        },
                    ],
                },
            ],
        },
        comments: {
            patterns: [
                {
                    name: "comment.line.double-slash.lsp-semantic.fusion",
                    match: "// ?(@fusion-.+)",
                    captures: {
                        "1": {
                            name: "support.other.comment.lsp-semantic.fusion",
                        },
                    },
                },
                {
                    name: "comment.line.double-slash.fusion",
                    match: "(?<!/)//(?!/).*",
                },
                {
                    name: "comment.line.number-sign.fusion",
                    match: "#.*",
                },
                {
                    name: "comment.block.fusion",
                    begin: "^\\s*/\\*(?!\\*)",
                    end: "\\*/",
                },
            ],
        },
        dsl: {
            patterns: [
                {
                    begin: "(afx)(`)",
                    beginCaptures: {
                        "1": {
                            name: "support.function.dsl.afx.fusion",
                        },
                        "2": {
                            name: "string.quoted.other.begin.afx.fusion",
                        },
                    },
                    end: "(`)",
                    endCaptures: {
                        "1": {
                            name: "string.quoted.other.end.afx.fusion",
                        },
                    },
                    contentName: "meta.embedded.block.html",
                    patterns: [
                        {
                            include: "text.html.derivative",
                        },
                    ],
                },
                {
                    name: "string.quoted.other.dsl.fusion",
                    begin: "([a-zA-Z_-]+)(`)",
                    beginCaptures: {
                        "1": {
                            name: "support.function.dsl.fusion",
                        },
                        "2": {
                            name: "string.quoted.other.begin.afx.fusion",
                        },
                    },
                    end: "(`)",
                    endCaptures: {
                        "1": {
                            name: "string.quoted.other.end.afx.fusion",
                        },
                    },
                },
            ],
        },
        injections_afx: {
            patterns: [
                {
                    begin: "(\\{)",
                    end: "(\\})",
                    beginCaptures: {
                        "1": {
                            name: "keyword.other.scope.begin.afx.fusion",
                        },
                    },
                    endCaptures: {
                        "1": {
                            name: "keyword.other.scope.end.afx.fusion",
                        },
                    },
                    patterns: [
                        {
                            include: "source.js#expression",
                        },
                    ],
                },
            ],
        },
    },
};
