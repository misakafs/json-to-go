import { TokenType } from './token'
import { Node, NodeType } from './parse'
import { Option } from './types'
import { getName } from '../util'

enum GoType {
    BOOL = 'bool',
    STRING = 'string',
    INT = 'int',
    FLOAT = 'float64',
    INTERFACE = 'interface{}',
    STRUCT = 'struct'
}

let seq = 1

// 匹配非字母开头
const regex = new RegExp(/^[a-zA-Z]{1}[\w-]*$/)
// 匹配数字
const regexD = new RegExp(/^(\-|\+)?\d+(\.\d+)?$/)

// go节点
class GoNode {
    // 记录原始的名字
    origin: string
    // 大驼峰命名的名字
    name: string
    kind?: string
    tag?: string
    // 子集是否允许出现为空的字段
    allowEmpty: boolean
    // allowEmpty = true 时，这个字段才有作用
    // 当前name被重复的次数，等于0表示这个字段属于允许为空
    repeatTimes: number
    // 记录子集中最长名字的长度 用于go格式化
    childNameMaxLength: number
    // 记录子集中最长类型的长度
    childKindMaxLength: number
    childs?: GoNode[]

    constructor(name: string) {
        this.origin = name
        this.name = getName(2, this._handlerName(name))
        this.allowEmpty = false
        this.repeatTimes = 0
        this.childNameMaxLength = 0
        this.childKindMaxLength = 0
    }

    // 处理一些特殊的 不规范的key
    _handlerName(name: string):string{
        name = name.trim()
        if (name === '') {
            name = 'EmptyField' + seq
            seq ++
        }
        // 不符合规范的名字
        if (!regex.test(name)) {
            if (regexD.test(name)) {
                name = 'NumberField' + seq
            } else {
                name = 'StringField' + seq
            }
            seq ++
        }
        return name
    }

    addNode(goNode: GoNode) {
        if (!this.childs) {
            this.childs = new Array()
        }
        if (goNode.name.length > this.childNameMaxLength) {
            this.childNameMaxLength = goNode.name.length
        }

        if (goNode.kind) {
            let kind = goNode.kind
            const index = goNode.kind.lastIndexOf('[]')
            let k = goNode.kind
            if (index > -1) {
                k = goNode.kind.slice(index + 2)
            }
            if (BaseTypes.indexOf(k) === -1) {
                kind = goNode.name
                if (index > -1) {
                    kind = kind.slice(0, index + 2) + goNode.name
                }
            }

            if (kind.length > this.childKindMaxLength) {
                this.childKindMaxLength = kind.length
            }
        }

        for (let i = this.childs.length - 1; i >= 0; i--) {
            if (goNode.name === this.childs[i]?.name) {
                this.childs[i] = goNode
                this.allowEmpty = true
                goNode.repeatTimes += 1
                return
            }
        }

        this.childs.push(goNode)
    }
}

type GoEmpty = GoNode | null | undefined

const BaseTypes = [GoType.BOOL.toString(), GoType.INT.toString(), GoType.FLOAT.toString(), GoType.STRING.toString(), GoType.INTERFACE.toString()]

// tag
interface Tag {
    name: string // 名字
    named: number // 命名方式
    omitempty: boolean // 是否忽略该字段
}

const default_opt = {
    // 根对象名
    rootName: 'RootObject',
    // 是否内联
    inline: false,
    // tag
    tags: [
        {
            name: 'json',
            named: 1,
            omitempty: false
        }
    ]
    // tags: []
}

export class CodegenGo {
    root?: GoNode
    opt?: Option
    result: string
    structs: string[]

    constructor(node: Node, opt?: Option) {
        seq = 1
        this.result = ''
        this.structs = new Array()
        this.opt = Object.assign({}, default_opt, this.opt)
        const r = this.gen(node)
        if (r) {
            this.result = this.codegen(r)
            if (!this.opt?.inline && this.structs.length) {
                this.result = this.structs.join('\n')
            }
        }
        this.result = this.result.trim()
    }

    addStruct(struct:string){
        for(let i = this.structs.length - 1; i >= 0; i --) {
            if(this.structs[i] === struct) {
                return
            }
        }
        this.structs.unshift(struct)
    }

    // 生成go节点树
    gen(node: Node, upType?: NodeType, upNode?: GoNode): GoNode | any {
        let goNode: GoNode | any = null
        switch (node.nodeType) {
            case NodeType.BASE:
                if (upType === NodeType.ARRAY) {
                    return null
                }
                if (!node.getToken()) {
                    return null
                }
                goNode = new GoNode(node?.key?.value ?? 'field')
                goNode.kind = this.getKind(node)
                return goNode
            case NodeType.ARRAY:
                if (upType !== NodeType.ARRAY) {
                    goNode = new GoNode(node?.key?.value ?? this.opt?.rootName)
                    goNode.kind = this.getKind(node)
                }
                for (let i = 0; i < node.size; i++) {
                    const gn = this.gen(node.getNodes()[i], NodeType.ARRAY, goNode ?? upNode)
                    if (gn) {
                        if (goNode) {
                            goNode?.addNode(gn)
                        } else {
                            if (upNode) {
                                upNode.addNode(gn)
                            }
                        }
                    }
                }
                return goNode
            case NodeType.OBJECT:
                if (upType === NodeType.ARRAY && node.size === 0) {
                    return null
                }
                goNode = new GoNode(node?.key?.value ?? this.opt?.rootName)
                goNode.kind = this.getKind(node)
                for (let i = 0; i < node.size; i++) {
                    const gn = this.gen(node.getNodes()[i], NodeType.OBJECT)
                    if (gn) {
                        goNode.addNode(gn)
                    }
                }
                if (upType === NodeType.ARRAY && upNode) {
                    for (let i = 0; i < goNode.childs.length; i++) {
                        upNode.addNode(goNode.childs[i])
                    }
                    return null
                }
                return goNode
        }
        return null
    }

    // 获取类型
    getKind(node: Node): string {
        switch (node.nodeType) {
            case NodeType.OBJECT:
                return GoType.STRUCT
            case NodeType.ARRAY:
                // 针对数组特殊处理
                if (node.size == 0) {
                    return '[]' + GoType.INTERFACE
                }

                let kind = this.getKind(node.getNodes()[0])
                for (let i = 1; i < node.size; i++) {
                    let k = this.getKind(node.getNodes()[i])
                    if (k !== kind) {
                        // 如果都是数字类型提升到float类型
                        if ((k === GoType.INT && kind === GoType.FLOAT) || (kind === GoType.INT && k === GoType.FLOAT)) {
                            kind = GoType.FLOAT
                            continue
                        }
                        return '[]' + GoType.INTERFACE
                    }
                }

                switch (kind) {
                    case GoType.BOOL:
                    case GoType.STRING:
                    case GoType.INT:
                    case GoType.FLOAT:
                        return '[]' + kind
                    default:
                        return '[]' + this.getKind(node.getNodes()[0])
                }
        }
        switch (node.getToken().tokenType) {
            case TokenType.BOOLEAN:
                return GoType.BOOL
            case TokenType.STRING:
                return GoType.STRING
            case TokenType.INTEGER:
                return GoType.INT
            case TokenType.FLOAT:
                return GoType.FLOAT
        }
        return GoType.INTERFACE
    }

    // 获取tag
    getTag(node: GoNode, upNode: GoEmpty = null): string {
        if (!this.opt?.tags?.length) {
            return ''
        }
        let tags: string[] = new Array()
        for (let i = 0; i < this.opt.tags.length; i++) {
            const tag = this.opt.tags[i]
            let s = `${tag.name}:"${getName(tag.named, node.origin)}`
            if (tag.omitempty) {
                s += ',omitempty'
            } else {
                if (upNode && upNode.allowEmpty && node.repeatTimes === 0) {
                    s += ',omitempty'
                }
            }
            s += '"'
            tags.push(s)
        }
        const s = tags.join(' ')
        return '`' + s + '`'
    }

    // 生成代码
    codegen(node: GoNode, upNode: GoEmpty = null, indent: string = ''): string {
        const padNameNumber = upNode?.childNameMaxLength ?? 0
        const padKindNumber = upNode?.childKindMaxLength ?? 0

        let result = ''

        if (node.kind && BaseTypes.indexOf(node.kind) !== -1) {
            result += `${indent}${node.name.padEnd(padNameNumber)} ${node.kind.padEnd(padKindNumber)} ${this.getTag(node, upNode)}\n`
        }

        if (this.opt?.inline) {
            result += this.codegen_inline(node, upNode, indent)
        } else {
            result += this.codegen_noinline(node, upNode, indent)
        }
        return result
    }

    // 生成内联
    codegen_inline(node: GoNode, upNode: GoEmpty = null, indent: string = ''): string {
        let result = ''
        if (node.kind === GoType.STRUCT) {
            result += `${indent.length ? indent : 'type '}${node.name} struct {\n`
            if (node.childs) {
                const length = node.childs?.length ?? 0
                for (let i = 0; i < length; i++) {
                    result += this.codegen(node.childs[i], node, '    ' + indent)
                }
            }

            if (indent.length) {
                result += `${indent}} ${this.getTag(node,upNode)}\n`
            } else {
                result += `${indent}}\n`
            }
        }
        if (node.kind?.indexOf('[]') !== -1) {
            const isStruct = (node.kind?.indexOf('struct') ?? -1) > -1
            result += `${indent.length ? indent : 'type '}${node.name} ${node.kind}`
            if (isStruct) {
                result += ` {\n`
            } else {
                result += `\n`
            }
            if (isStruct && node.childs) {
                const length = node.childs?.length ?? 0
                for (let i = 0; i < length; i++) {
                    result += this.codegen(node.childs[i], node, '    ' + indent)
                }
            }
            if (isStruct) {
                if (indent.length) {
                    result += `${indent}} ${this.getTag(node,upNode)}\n`
                } else {
                    result += `${indent}}\n`
                }
            }
        }
        return result
    }

    // 非内联
    codegen_noinline(node: GoNode, upNode: GoEmpty = null, indent: string = ''): string {
        const padNameNumber = upNode?.childNameMaxLength ?? 0
        const padKindNumber = upNode?.childKindMaxLength ?? 0

        let result = ''
        if (node.kind === GoType.STRUCT) {
            let r = ''
            if (upNode) {
                result += `${indent.length ? indent : 'type '}${node.name.padEnd(padNameNumber)} ${node.name.padEnd(padKindNumber)} ${this.getTag(node, upNode)}\n`
            }
            r += `type ${node.name} struct {\n`

            if (node.childs) {
                const length = node.childs.length ?? 0
                for (let i = 0; i < length; i++) {
                    r += this.codegen(node.childs[i], node, '    ')
                }
            }
            r += `}\n`
            this.addStruct(r)
        }
        if (node.kind && node.kind.indexOf('[]') !== -1) {
            const isStruct = (node.kind.indexOf('struct') ?? -1) > -1
            let r = ''
            if (isStruct) {
                r += `type ${node.name} ${indent.length ? 'struct' : node.kind} {\n`
                const kind = node.kind.replaceAll('struct', '') + node.name
                result += `${indent}${node.name.padEnd(padNameNumber)} ${kind.padEnd(padKindNumber)} ${this.getTag(node, upNode)}\n`
            } else {
                result += `${indent.length ? indent : 'type '}${node.name.padEnd(padNameNumber)} ${node.kind.padEnd(padKindNumber)}`
                if (indent.length) {
                    result += ` ${this.getTag(node, upNode)}`
                }
                result += '\n'
            }

            if (isStruct && node.childs) {
                const length = node.childs.length ?? 0
                for (let i = 0; i < length; i++) {
                    r += this.codegen(node.childs[i], node, '    ')
                }
            }
            if (isStruct) {
                r += `}\n`
                this.addStruct(r)
            }
        }
        return result
    }
}
