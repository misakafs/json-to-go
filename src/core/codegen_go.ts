import humps from 'humps/index'
import { TokenType } from './token'
import { Node, NodeType } from './parse'

// GO内置类型
export enum GoKind {
    OBJECT,
    ARRAY,
    NIL,
    INTEGER = 'int',
    FLOAT = 'float64',
    BOOLEAN = 'bool',
    STRING = 'string',
    INTERFACE = 'interface{}'
}

// tokenType对应的go类型
export function getGoKind(tokenType: TokenType): GoKind {
    switch (tokenType) {
        case TokenType.BOOLEAN:
            return GoKind.BOOLEAN
        case TokenType.STRING:
            return GoKind.STRING
        case TokenType.INTEGER:
            return GoKind.INTEGER
        case TokenType.FLOAT:
            return GoKind.FLOAT
        default:
            return GoKind.INTERFACE
    }
}

// Tag的命名方式
const tagNamedWays = {
    // abcDef
    0: function(s:string):string {
        return humps.camelize(s)
    },
    // AbcDef
    1: function(s:string):string {
        return humps.pascalize(s)
    },
    // abc_def
    2: function(s:string):string {
        return humps.decamelize(s)
    },
    // Abcdef
    3: function(s:string):string {
        s = humps.decamelize(s,{ separator: '' })
        return s.replace(s[0], s[0].toUpperCase())
    },
    // abcdef
    4: function(s:string):string {
        return humps.decamelize(s,{ separator: '' })
    },
}

class GoNode {
    name: string
    kind: GoKind
    childs: GoNode[]

    constructor(name: string = 'Root', kind: GoKind = GoKind.OBJECT) {
        this.name = name
        this.kind = kind
        this.childs = new Array()
    }

    addChild(goNode: GoNode) {
        this.childs.push(goNode)
    }
}

// export class CodegenGo {
//     root: GoNode
//
//     constructor(node: Node) {
//         this.root = new GoNode()
//
//         this.traverseTree(node)
//     }
//
//     // 遍历树
//     traverseTree(node: Node) {
//         if (node.nodeType === NodeType.OBJECT && node.size) {
//             for (let i = 0; i < node.size; i++) {
//                 const gn = new GoNode(node.childs[i].key.value, getGoKind(node.childs[i].value?.tokenType))
//                 this.root.addChild(gn)
//             }
//         }
//     }
// }
