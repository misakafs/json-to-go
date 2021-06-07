import { TokenType } from './token'
import { Node, NodeType } from './parse'
import { Option } from './types'
import { getName } from '../util/index'

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

export class CodegenGo {
    content: string
    opt?: Option

    constructor(node: Node, opt?: Option) {
        this.content = 'func main() {\nprintln() }'
        this.opt = opt
        this.traverseTree(node)
    }

    // 生成tag
    genTags(name: string): string {
        if (!this.opt?.tags?.length) {
            return ''
        }
        const tags = this.opt.tags as string[]
        const length = tags.length
        let s = '`'
        for (let i = 0; i < length; i++) {
            const cols = tags[i].split('|')
            if (!cols.length) {
                continue
            }
            const tagName = getName(Number.parseInt(cols[1] ?? '0'), name)
            s += `${cols[0]}:"${tagName}"`
            if (i < length - 1) {
                s += ','
            }
        }
        s += '`'
        return s
    }

    // 格式化
    format(): string {
        return ''
    }

    // 遍历树
    traverseTree(node: Node) {
        if (node.nodeType === NodeType.OBJECT && node.size) {
            for (let i = 0; i < node.size; i++) {}
        }
    }
}
