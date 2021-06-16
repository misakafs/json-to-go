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

// go节点
class GoNode {
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
        this.name = name
        this.allowEmpty = false
        this.repeatTimes = 0
        this.childNameMaxLength = 0
        this.childKindMaxLength = 0
    }

    addNode(goNode: GoNode) {
        if (!this.childs) {
            this.childs = new Array()
        }
        if (goNode.name.length > this.childNameMaxLength) {
            this.childNameMaxLength = goNode.name.length
        }
        if ((goNode.kind?.length ?? 0) > this.childKindMaxLength) {
            this.childKindMaxLength = goNode.kind?.length ?? 0
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
    name: string   // 名字
    named: number  // 命名方式
    omitempty: boolean // 是否忽略该字段
}

const default_opt = {
    // 根对象名
    rootName: 'RootObject',
    // 是否内联
    inline: false,
    // tag
    tags: [{
        name: 'json',
        named: 0,
        omitempty: false
    }]
}

export class CodegenGo {
    root?: GoNode
    opt?: Option
    result: string
    structs: string[]

    constructor(node: Node, opt?: Option) {
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

    // 生成go节点树
    gen(node: Node, upType?: NodeType, upNode?: GoNode): GoNode | any {
        let goNode: GoNode | any = null
        switch (node.nodeType) {
            case NodeType.BASE:
                if (upType === NodeType.ARRAY) {
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

    // 生成代码
    codegen(node: GoNode, upNode:GoEmpty = null, indent:string = ''): string {
        let padNameNumber = 0
        let padKindNumber = 0
        if (upNode) {
            padNameNumber = upNode.childNameMaxLength
            padKindNumber = upNode.childKindMaxLength
        }
        let result = ''

        if (node.kind && BaseTypes.indexOf(node.kind) !== -1) {
            result += `${indent}${getName(1,node.name).padEnd(padNameNumber)} ${node.kind.padEnd(padKindNumber)}\n`
        }

        if (this.opt?.inline) {
            result += this.codegen_inline(node, upNode, indent)
        } else {
            result += this.codegen_noinline(node, upNode, indent)
        }
        return result
    }

    // 生成内联
    codegen_inline(node: GoNode, upNode:GoEmpty = null, indent:string = ''): string{
        let result = ''
        if (node.kind === GoType.STRUCT) {
            result += `${indent.length ? indent : 'type '}${node.name} struct {\n`
            if (node.childs) {
                const length = node.childs?.length ?? 0
                for (let i = 0; i < length; i++) {
                    result += this.codegen(node.childs[i], node, '    ')
                }
            }
            result += `${indent}}\n`
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
                    result += this.codegen(node.childs[i], node,'    ' + indent)
                }
            }
            if (isStruct) {
                result += `${indent}}\n`
            }
        }
        return result
    }

    // 非内联
    codegen_noinline(node: GoNode, upNode:GoEmpty = null, indent:string = ''): string{
        let padNameNumber = 0
        let padKindNumber = 0
        if (upNode) {
            padNameNumber = upNode.childNameMaxLength
            padKindNumber = upNode.childKindMaxLength
        }
        let result = ''
        if (node.kind === GoType.STRUCT) {
            let r = ''
            if (upNode) {
                result += `${indent.length ? indent : 'type '}${getName(1, node.name).padEnd(padNameNumber)} ${getName(1, node.name).padEnd(padKindNumber)}\n`
            }
            r += `type ${getName(1, node.name)} struct {\n`

            if (node.childs) {
                const length = node.childs?.length ?? 0
                for (let i = 0; i < length; i++) {
                    r += this.codegen(node.childs[i], node,'    ')
                }
            }
            r += `}\n`
            this.structs.unshift(r)
        }
        if (node.kind?.indexOf('[]') !== -1) {
            const isStruct = (node.kind?.indexOf('struct') ?? -1) > -1
            let r = ''
            if (isStruct) {
                r += `type ${getName(1, node.name)} ${indent.length ? 'struct' : node.kind} {\n`
                result += `${indent}${getName(1, node.name).padEnd(padNameNumber)} ${node.kind?.replaceAll('struct','')}${getName(1, node.name)}\n`
            } else {
                result += `${indent.length ? indent : 'type '}${getName(1, node.name)} ${node.kind}\n`
            }

            if (isStruct && node.childs) {
                const length = node.childs?.length ?? 0
                for (let i = 0; i < length; i++) {
                    r += this.codegen(node.childs[i], node,'    ')
                }
            }
            if (isStruct) {
                r += `}\n`
                this.structs.unshift(r)
            }
        }
        return result
    }
}
