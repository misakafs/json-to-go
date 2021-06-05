import { Token, TokenType } from './token'
import { Node, NodeType } from './parse'

export class CodegenJson {
    json: string
    constructor(node: Node) {
        this.json = ''
        this.traverseTree(node)
    }

    // 遍历树
    traverseTree(node: Node) {
        const length = node.size - 1
        if (node.key) {
            this.json += `"${node.key.value}":`
        }
        this.handlerElement(node)
        if (node.nodeType === NodeType.OBJECT) {
            this.json += '{'
            for (let i = 0; i < node.size; i++) {
                this.traverseTree(node.getNodes()[i])
                this.json += i == length ? '' : ','
            }
            this.json += '}'
        }
        if (node.nodeType === NodeType.ARRAY) {
            this.json += '['
            for (let i = 0; i < node.size; i++) {
                this.traverseTree(node.getNodes()[i])
                this.json += i == length ? '' : ','
            }
            this.json += ']'
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
                    this.json += value
                    break
                case TokenType.STRING:
                    this.json += `"${value}"`
                    break
            }
        }
    }
}
