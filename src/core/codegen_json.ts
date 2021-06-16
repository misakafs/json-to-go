import { Token, TokenType } from './token'
import { Node, NodeType } from './parse'
import { Option } from './types'

export class CodegenJson {
    layer: number
    result: string
    opt?: Option
    constructor(node: Node, opt?: Option) {
        this.layer = 0
        this.result = ''
        this.opt = opt
        this.traverseTree(node)
        this.result = this.result.trim()
    }

    getIndent(): string {
        if (!this.opt?.format) {
            return ''
        }
        return '    '.repeat(this.layer)
    }

    getSpace(): string {
        if (!this.opt?.format) {
            return ''
        }
        return ' '
    }

    getWrapRow(): string {
        if (!this.opt?.format) {
            return ''
        }
        return '\n'
    }

    // 遍历树
    traverseTree(node: Node) {
        const length = node.size - 1
        if (node.key) {
            this.result += `${this.getIndent()}"${node.key.value}":${this.getSpace()}`
        }
        this.handlerElement(node)
        if (node.nodeType === NodeType.OBJECT) {
            this.result += `{${this.getWrapRow()}`
            this.layer++
            for (let i = 0; i < node.size; i++) {
                this.traverseTree(node.getNodes()[i])
                this.result += i == length ? `${this.getWrapRow()}` : `,${this.getWrapRow()}`
            }
            this.layer--
            this.result += `${this.getIndent()}}`
        }
        if (node.nodeType === NodeType.ARRAY) {
            this.result += '['
            for (let i = 0; i < node.size; i++) {
                this.traverseTree(node.getNodes()[i])
                this.result += i == length ? '' : `${this.getSpace()},`
            }
            this.result += ']'
        }
    }

    // 处理基本元素
    handlerElement(node: Node) {
        if (node?.value) {
            let value = node.getToken().value
            switch (node.getToken().tokenType) {
                case TokenType.INTEGER:
                    value = Number.parseInt(value).toString()
                case TokenType.FLOAT:
                    value = Number.parseFloat(value).toString()
                case TokenType.NULL:
                case TokenType.BOOLEAN:
                    this.result += value
                    break
                case TokenType.STRING:
                    this.result += `"${value}"`
                    break
            }
        }
    }
}
