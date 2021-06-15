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

const baseTypes = [GoType.BOOL.toString(), GoType.STRING.toString(), GoType.INT.toString(), GoType.FLOAT.toString()]

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

const default_opt = {
    rootName: 'RootObject'
}

export class CodegenGo {
    root?: GoNode
    opt?: Option
    result: string

    constructor(node: Node, opt?: Option) {
        this.result = ''
        this.opt = Object.assign({}, default_opt, this.opt)
        const r = this.gen(node)
        if (r) {
            console.log(JSON.stringify(r, null, '  '))
            this.codegen(r)
            console.log(this.result)
        }
    }

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

    // 生成
    codegen(node: GoNode, up: string = '') {
        if (node.kind === GoType.BOOL) {
            this.result += `${up}${node.name} ${node.kind}\n`
        }
        if (node.kind === GoType.INT) {
            this.result += `${up}${node.name} ${node.kind}\n`
        }
        if (node.kind === GoType.FLOAT) {
            this.result += `${up}${node.name} ${node.kind}\n`
        }
        if (node.kind === GoType.STRING) {
            this.result += `${up}${node.name} ${node.kind}\n`
        }
        if (node.kind === GoType.INTERFACE) {
            this.result += `${up}${node.name} ${node.kind}\n`
        }
        if (node.kind === GoType.STRUCT) {
            this.result += `${up.length ? up : 'type '}${node.name} struct {\n`
            if (node.childs) {
                const length = node.childs?.length ?? 0
                for (let i = 0; i < length; i++) {
                    this.codegen(node.childs[i], '    ' + up)
                }
            }
            this.result += `${up}}\n`
        }
        if (node.kind?.indexOf('[]') !== -1) {
            const isStruct = (node.kind?.indexOf('struct') ?? -1) > -1
            if (isStruct) {
                this.result += `${up.length ? up : 'type '}${node.name} ${node.kind} {\n`
            } else {
                this.result += `${up.length ? up : 'type '}${node.name} ${node.kind}\n`
            }

            if (isStruct && node.childs) {
                const length = node.childs?.length ?? 0
                for (let i = 0; i < length; i++) {
                    this.codegen(node.childs[i], '    ' + up)
                }
            }

            if (isStruct) {
                this.result += `${up}}\n`
            }
        }
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
}

/*
[{"a":1231},{"a":1231, "b":123},{"a":1231}]
type Root struct {
    A int `json:"a"`
    B int `json:"b,omitempty"`
}

[[[[[[[[[[[[[1]]]]]]]]]]]]]
type Root [][][][][][][][][][][][][]int

{"c":[[{"d":[{"e":[true]}]}]]}
type E struct {
    E []bool `json:"e`
}
type D struct {
    E []E `json:"d"`
}
type Root struct {
    C [][]D `json:"c"`
}

{"a":1,"b":true,"c":false,"d":null,"e":-1.234,"f":"xxx"}
type Root struct {
    A int `json:"a"`
    B bool `json:"b"`
    C bool `json:"c"`
    D interface{} `json:"d"`
    E float64 `json:"e"`
    F string `json:"f"`
}

[[{"d":[{"e":[true]}],"x":123}]]
type Root [][]struct {
	D []D `json:"d"`
	X int `json:"x"`
}
type D struct {
	E []bool `json:"e"`
}


[]
type Root []interface{}

{}
type Root struct{}

[{}]
type Root []struct{}
 */
