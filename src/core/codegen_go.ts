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

const baseTypes = [
    GoType.BOOL.toString(),
    GoType.STRING.toString(),
    GoType.INT.toString(),
    GoType.FLOAT.toString()
]

// go节点
class GoNode {
    name: string
    kind?: string
    tag?: string
    OmitEmpty?: boolean
    childs?: GoNode[]

    constructor(name: string) {
        this.name = name
    }

    addNode(goNode: GoNode) {
        if (!this.childs) {
            this.childs = new Array()
        }
        for (let i = this.childs.length - 1; i >= 0; i--) {
            if (goNode.name === this.childs[i]?.name) {
                this.childs[i] = goNode
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
    structs: GoNode[]

    constructor(node: Node, opt?: Option) {
        this.result = ''
        this.structs = new Array()
        this.opt = Object.assign({}, default_opt, this.opt)
        const r = this.gen(node)
        if (r) {
            this.result = JSON.stringify(r,null,"  ")
            console.log(this.result)
        }

    }

    gen(node: Node, upType?: NodeType, upNode?: GoNode):(GoNode|any) {
        let goNode:GoNode|any = null
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
                        if(goNode) {
                            goNode?.addNode(gn)
                        } else {
                            if(upNode) {
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
                    const gn = this.gen(node.getNodes()[i],NodeType.OBJECT)
                    if(gn){
                        goNode.addNode(gn)
                    }
                }
                if(upType === NodeType.ARRAY && upNode) {
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
    codegen(node: GoNode){
        const length = node.childs?.length ?? 0
        switch (node.kind) {
            case GoType.BOOL:
                this.result += `    ${getName(1,node.name)} ${node.kind}\n`
                break
            case GoType.STRING:
                this.result += `    ${getName(1,node.name)} ${node.kind}\n`
                break
            case GoType.INT:
                this.result += `    ${getName(1,node.name)} ${node.kind}\n`
                break
            case GoType.FLOAT:
                this.result += `    ${getName(1,node.name)} ${node.kind}\n`
                break
            case GoType.INTERFACE:
                this.result += `    ${getName(1,node.name)} ${node.kind}\n`
                break
            case GoType.STRUCT:
                this.result += `type ${getName(1, node.name)} struct {\n`
                break
            default:
                this.result += `    ${getName(1,node.name)} ${node.kind}\n`
        }
        if (!length) {
            return
        }
        for (let i = 0; i < length; i++) {
        }
        this.result += '}'
    }

    // 获取类型
    getKind(node: Node):string{
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

    // 判断是否是基础类型
    isBaseType(kind:string):boolean {
        const k = kind.replaceAll('[]','')
        return baseTypes.indexOf(k) > -1
    }

    // 判断是否是切片
    isSince(kind:string): boolean{
        return kind.indexOf('[]') > -1
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
